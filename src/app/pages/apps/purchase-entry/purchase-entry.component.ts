import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core'
import * as moment from 'moment'
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service'
import { NzNotificationService } from 'ng-zorro-antd'
import { Observable, Subject } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import { purchaselistmodule } from './purchase.module'
import _ from "lodash";
import { PrintService } from 'src/app/services/print/print.service'


@Component({
  selector: 'app-purchase-entry',
  templateUrl: './purchase-entry.component.html',
  styleUrls: ['./purchase-entry.component.scss'],
})
export class PurchaseEntryComponent implements OnInit {
  purchase = purchaselistmodule
  model: any = 'QWERTY'
  inputValue: string = ''
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.products
            .filter(
              v =>
                v.product.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                v.barCode?.toLowerCase().indexOf(term.toLowerCase()) > -1,
            )
            .slice(0, 10),
      ),
    )

  formatter = (x: { product: string }) => x.product

  searchvendor = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.vendors
            .filter(v => v.businessName.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10),
      ),
    )

  formattervendor = (x: { businessName: string }) => x.businessName

  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any> //productinput
  @ViewChild('discper', { static: false }) public discperel: TemplateRef<any>
  @ViewChild('disc', { static: false }) public discel: TemplateRef<any>
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef
  buffer = ''
  paymenttypeid = 1
  isuppercase: boolean = false
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let data = this.buffer || ''
    if (event.key !== 'Enter' && event.key !== 'Shift') {
      // barcode ends with enter -key
      if (this.isuppercase) {
        data += event.key.toUpperCase()
        this.isuppercase = false
      } else {
        data += event.key
      }
      this.buffer = data
    } else if (event.key === 'Shift') {
      this.isuppercase = true
    } else {
      this.buffer = ''
      this.setproductbybarcode(data)
    }
    // console.log(event)
  }
  scrollContainer: any
  products: any = []
  vendors: any = []
  filteredvalues = []
  barcValue: string = ''
  cartitems: any = []
  subtotal = 0
  ProductTax = 0
  searchTerm = ''
  tax = 0
  discount = 0
  BillAmount = 0
  isVisible = false
  batchno = 0
  show = true;
  temporaryItem: any = {
    Id: 0,
    product: '',
    quantity: null,
    tax: 0,
    amount: 0,
    price: null,
    tax1: 0,
    Tax1: 0,
    Tax2: 0,
    barcode_Id: 0,
    disc: null,
    taxpercent: 0,
  }
  barcodeItem = { quantity: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0 }
  barcodemode: boolean = false

  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private printservice: PrintService,
  ) { }

  loginfo
  CompanyId: any
  StoreId: any
  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'printersettings']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      this.printersettings = data['printersettings'][0]
      console.log(this.loginfo)
      console.log(this.CompanyId)
      this.getVendorList();
      this.getBarcodeProduct()

      this.products = []
      this.vendors = []
      this.getpurchaselist()
    })


    this.temporaryItem.quantity = null
    this.products.forEach(product => {
      product.quantity = null
      product.tax = 0
      product.amount = 0
    })
  }
  getBarcodeProduct() {
    this.Auth.getBarcodeProduct(this.loginfo.companyId, this.loginfo.storeId).subscribe(data => {
      console.log(data)
      this.products = data['products']
      this.batchno = data['lastbatchno'] + 1
      console.log(this.ordNo)
    })
  }
  getVendorList() {
    this.Auth.getvendors(this.loginfo.companyId).subscribe(data => {
      this.vendors = data
      console.log(this.vendors)

    })
  }
  setproductbybarcode(code) {
    console.log(
      code,
      this.products.filter(x => x.Product == code),
    )
    var product = this.products.filter(x => x.Product == code)[0]
    if (product) {
      this.temporaryItem = product
      this.temporaryItem.quantity = null
      this.temporaryItem.amount = this.temporaryItem.price * this.temporaryItem.quantity
      this.temporaryItem.tax =
        ((this.temporaryItem.Tax1 + this.temporaryItem.Tax2) * this.temporaryItem.amount) / 100
      this.temporaryItem.amount = +this.temporaryItem.amount.toFixed(2)
      if (this.cartitems.some(x => x.Id == this.temporaryItem['Id'])) {
        this.cartitems.filter(
          x => x.Id == this.temporaryItem['Id'],
        )[0].quantity += this.temporaryItem.quantity
      } else {
        this.cartitems.push(Object.assign({}, this.temporaryItem))
      }
      this.calculate()
      this.temporaryItem = {
        Id: 0,
        quantity: null,
        taxpercent: 0,
        tax: 0,
        tax1: 0,
        amount: 0,
        price: null,
        Tax1: 0,
        Tax2: 0,
        barcode_Id: 0,
        disc: 0,
        product: '',
      }
      8901803000179
    }
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  submitted: boolean = false
  addItem() {
    this.submitted = true
    if (this.validation()) {
      this.cartitems.push(Object.assign({}, this.temporaryItem))
      console.log('cartitems', this.cartitems)
      this.calculate()
      this.temporaryItem.quantity = null
      this.temporaryItem.price = null
      this.temporaryItem.disc = null
      this.temporaryItem = {
        Id: 0,
        quantity: null,
        taxpercent: null,
        tax: 0,
        tax1: 0,
        amount: 0,
        price: null,
        Tax1: 0,
        Tax2: 0,
        barcode_Id: 0,
        disc: 0,
        product: '',
      }
      console.log(this.productinput)
      this.productinput['nativeElement'].focus()
      this.model = ''
      this.filteredvalues = []
      this.submitted = false
    }
  }

  barcodereaded(event) {
    console.log(event)
    console.log(event.element.nativeElement.id)
    var product = this.products.filter(x => x.Id == +event.element.nativeElement.id)[0]
    this.inputValue = product.Product
    this.barcodeItem = product
    this.barcodeItem.quantity = 1
    if (this.cartitems.some(x => x.Id == this.barcodeItem['Id'])) {
      this.cartitems.filter(
        x => x.Id == this.barcodeItem['Id'],
      )[0].quantity += this.barcodeItem.quantity
    } else {
      this.cartitems.push(Object.assign({}, this.barcodeItem))
    }
    this.calculate()
    this.barcodeItem = { quantity: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0 }
    this.barcValue = ''
  }
  delete(index) {
    this.cartitems.splice(index, 1)
    this.calculate()
  }
  settotalprice(i, qty) {
    this.cartitems[i].BillAmount = this.cartitems[i].price * this.cartitems[i].quantity
    this.cartitems[i].ProductTax =
      (this.cartitems[i].amount * (this.cartitems[i].Tax1 + this.cartitems[i].Tax2)) / 100
    console.log(
      i,
      this.cartitems[i].price,
      this.cartitems[i].quantity,
      this.cartitems[i].amount,
      qty,
    )
    this.cartitems[i].amount = +this.cartitems[i].amount.toFixed(2)
    this.calculate()
  }
  calculate() {
    this.subtotal = 0
    this.ProductTax = 0
    this.discount = 0
    this.cartitems.forEach(item => {
      console.log(item)
      item.amount = item.price * item.quantity
      // item.tax = (item.taxpercent * item.amount) / 100
      item.amount = +item.amount.toFixed(2) - item.disc
      this.subtotal += item.price * item.quantity
      this.ProductTax += item.tax1 + item.tax2
      this.discount += item.disc
      item.BillAmount = item.amount
      item.PaidAmount = item.BillAmount
    })
    this.subtotal = +this.subtotal.toFixed(2)
    this.ProductTax = +this.ProductTax.toFixed(2)
    this.discount = +this.discount.toFixed(2)
    this.BillAmount = +(this.ProductTax + this.subtotal).toFixed(2)
  }
  date = new Date()
  dateFilter = ""
  onChange(e) {
    console.log(e, moment(e).format("YYYY-MM-DD"), this.date)
    this.dateFilter = moment(e).format("YYYY-MM-DD")
    this.filtersearch()
  }
  showModal(): void {
    this.isVisible = true
  }

  handleOk(): void {
    console.log('Button ok clicked!')
    this.isVisible = false
  }

  handleCancel(): void {
    console.log('Button cancel clicked!')
    this.isVisible = false
  }
  openCustomClass(content) {
    this.modalService.open(content, { centered: true })
  }
  opensplit(content) {
    this.modalService.open(content, { centered: true })
  }
  //////////////////////////////////////////rough////////////////////////////////////////////////////////
  selectedItem(item) {
    console.log(item)
    this.temporaryItem.disc = null
    Object.keys(item).forEach(key => {
      this.temporaryItem[key] = item[key]
    })
    this.quantityel['nativeElement'].focus()
  }

  selectvendors: any = []
  selectedvendoritem(item) {
    this.selectvendors = item
    console.log(this.selectvendors)
  }
  productbybarcode = []
  barcode = ''
  searchbybarcode() {
    this.productbybarcode = this.products.filter(x => x.barCode == this.barcode)[0]
    console.log(this.barcode, this.productbybarcode, this.products)
    this.model = this.productbybarcode['product']
  }
  validation() {
    var isvalid = true
    if (this.temporaryItem.product == '') isvalid = false
    if (this.temporaryItem.quantity <= 0) isvalid = false
    if (this.temporaryItem.price <= 0) isvalid = false
    return isvalid
  }

  back() {
    this.show = !this.show;
    this.submitted = false;
    this.temporaryItem = {
      Id: 0,
      product: '',
      quantity: null,
      tax: 0,
      amount: 0,
      price: null,
      tax1: 0,
      Tax1: 0,
      Tax2: 0,
      barcode_Id: 0,
      disc: null,
      taxpercent: 0,
    }
    this.barcodeItem = { quantity: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0 }


  }

  purchaselist = {
    OrderNo: 0,
    ProductName: '',
    ProductQty: 0,
    ProductPrice: 0,
    ProductTax: 0,
    BillAmount: 0,
    PaidAmount: 0,
    VendorName: '',
    VendorNumber: '',
    VendorAddress: '',
    ReceviedDate: '',
    StoreId: 0
  }
  // orderkey = { orderno: 1, timestamp: 0, GSTno: '' }
  payload: any
  ordNo = 0
  savepurchase() {
    console.log(this.ordNo)
    // this.purchaselist.OrderNo = this.orderkey.orderno
    this.purchaselist.BillAmount = this.cartitems[0].BillAmount
    const arr = this.cartitems.map(x => {
      return {
        OrderNo: this.ordNo,
        ProductName: x.product.product,
        ProductQty: x.quantity,
        ProductPrice: x.price,
        ProductTax: x.tax1 + x.tax2 + x.tax3,
        BillAmount: x.BillAmount,
        PaidAmount: x.PaidAmount,
        VendorName: this.selectvendors.businessName,
        VendorNumber: this.selectvendors.phoneNo,
        VendorAddress: this.selectvendors.address,
        ReceviedDate: moment().format('YYYY-MM-DD h:mm:ss'),
        StoreId: this.loginfo.storeId
      }

    })
    console.log(arr)
    this.Auth.savepurchaselist(arr).subscribe(data => {
      console.log(data);
      this.getpurchaselist()
      this.cartitems = []
      this.calculate()
    })
    this.getpurchaselist()
  }
  list: any
  result: any[];
  purchase_list = []

  getpurchaselist() {
    this.Auth.purchaselist(this.StoreId).subscribe(data => {
      this.list = data


      console.log(this.list)
      // this.show = true
      var gp = _.mapValues(
        _.groupBy(
          this.list,
          'orderNo',
        ),
      )
      console.log(gp);
      let arr = []
      Object.keys(gp).forEach(key => {
        const obj = {
          orderno: key,
          billamount: gp[key].map(qq => qq.billAmount).reduce((prev, curr) => prev + curr, 0),//[0].billAmount,
          paidamount: gp[key].map(qq => qq.paidAmount).reduce((prev, curr) => prev + curr, 0), //paidAmount,
          vendorName: gp[key][0].vendorName,
          vendorAddress: gp[key][0].vendorAddress,
          vendorNumber: gp[key][0].vendorNumber,
          receivedDate: gp[key][0].receviedDate,
          productTax: gp[key].map(qq => qq.productTax).reduce((prev, curr) => prev + curr, 0), //productTax,
          items: gp[key]
        }
        arr.push(obj)
      })
      console.log(arr)
      this.purchase_list = arr.sort(mycomparator)
      this.masterlist = arr.sort(mycomparator)
      this.show = true
      function mycomparator(a,b) {
        return b.orderno - a.orderno
      }

    })
  }
  listid: any
  groupArr: any
  selected_order = null
  getbyid(items, modalRef) {
    this.selected_order = items
    this.openDetailpopup(modalRef)
  }

  openDetailpopup(contentdetail) {
    const modalRef = this.modalService
      .open(contentdetail, {
        ariaLabelledBy: "modal-basic-title",
        centered: true
      })
      .result.then(
        result => {
        },
        reason => {
        }
      );
  }

  term: string = ''
  masterlist = []
  filtersearch(): any {
    this.purchase_list = this.term
      ? this.masterlist.filter(x => x.vendorName.toLowerCase().includes(this.term.toLowerCase()))
      : (this.dateFilter != "" && this.dateFilter != 'Invalid date') ? this.masterlist.filter(x => moment(x.receivedDate).format("YYYY-MM-DD") == this.dateFilter)
      : this.masterlist
    console.log(this.purchase_list)
  }

  // print


  print(): void {
    let printContents, popupWin
    printContents = document.getElementById('demo').innerHTML
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto')
    popupWin.document.open()
    popupWin.document.write(`
    <html>
      <head>
        <title>Print tab</title>
        <style>
        @media print {
          app-root > * { display: none; }
          app-root app-print-layout { display: block; }
          .header{
            text-align: center;
          }
          th{
            text-align: left
        }
          body   { font-family: 'Courier New', Courier, monospace; width: 300px }
          br {
            display: block; /* makes it have a width */
            content: ""; /* clears default height */
            margin-top: 0; /* change this to whatever height you want it */
          }
          hr.print{
            display: block;
            height: 1px;
            background: transparent;
            width: 100%;
            border: none;
            border-top: dashed 1px #aaa;
        }
        tr.print
          {
            border-bottom: 1px solid #000;;
          }
        }
        </style>
      </head>
  <body onload="window.print();window.close()">${printContents}</body>
    </html>`)
    popupWin.document.close()
  }
  electronPrint() {
    this.printreceipt()
    var element = `<div class="header">
    <h2>${this.loginfo.name}</h2>
    <strong>Purchase List</strong>
    <div hidden class="header">

        <h3 hidden></h3>
    </div>
    <hr>
     <h2 style="font-size:15px">Vendor: ${this.selected_order.vendorName} <h2/>
   <h2 style="font-size:15px">Address : ${this.selected_order.vendorAddress} <h2/>
   <h2 style="font-size:15px">Phone   : ${this.selected_order.vendorNumber} <h2/>
   <hr>
    <table class="item-table">
        <thead class="nb">
            <th class="text-left" style="width: 100px;">ITEM</th>
            <th>PRICE</th>
            <th>QTY</th>
            <th class="text-right">AMOUNT</th>
        </thead>
        <tr>
       <hr>
      </tr>
        <tbody>`
    this.selected_order.items.forEach(it => {
      element =
        element + `<tr class="nb">
                            <td class="text-left">${it.productName}</td>
                            <td>${it.productPrice}</td>
                            <td>${it.productQty}</td>
                            <td class="text-right">${it.billAmount}</td>
                        </tr>`
    });
    element =
      element +
      `
      <tr class="bt">
          <td class="text-left"><strong>Sub Total</strong></td>
          <td colspan="2"></td>
          <td class="text-right">${this.selected_order.paidamount}</td>
      </tr>
      <tr class="nb" hidden>
          <td class="text-left"><strong>Discount</strong></td>
          <td colspan="2"></td>
          <td class="text-right">${this.selected_order.DiscAmount}</td>
      </tr>
      <tr class="nb" >
          <td class="text-left"><strong>CGST</strong></td>
          <td colspan="2"></td>
          <td class="text-right">${this.selected_order.productTax}</td>
      </tr>

            <tr class="nb">
                <td class="text-left"><strong>Paid</strong></td>
                <td colspan="2"></td>
                <td class="text-right">${this.selected_order.paidamount}</td>
            </tr>
            <tr class="nb">
                <td class="text-left"><strong>Total</strong></td>
                <td colspan="2"></td>
                <td class="text-right">${this.selected_order.billamount + this.selected_order.productTax}</td>
            </tr>

          </tbody>
        </table>
        <hr>
        <div class="text-center">
        <strong style="margin-left:30px;font-size:15px">Powered By BizDom.</strong>
        </div>
      </div>
  table{
    empty-cells: inherit;
    font-family: Helvetica;
    font-size: small;
    width: 290px;
    padding-left: 0px;
  }
  th{
    text-align: left
  }
  hr{
    border-top: 1px dashed black
  }
  tr.bordered {
    border-top: 100px solid #000;
    border-top-color: black;
  }
</style>`
  }

  printersettings = { receiptprinter: '' }
  printhtmlstyle = `
  <style>
  body
  {
    counter-reset: Serial;           /* Set the Serial counter to 0 */
   }
    #printelement {
      width: 200px;
    }
    .header {
        text-align: center;
    }
    .item-table {
        width: 100%;
    }
    .text-right {
      text-align: right!important;
    }
    .text-left {
      text-align: left!important;
    }
    .text-center {
      text-align: center!important;
    }
    tr.nb, thead.nb {
        border-top: 0px;
        border-bottom: 0px;
    }
    table, p, h3 {
      empty-cells: inherit;
      font-family: Helvetica;
      font-size: small;
      width: 290px;
      padding-left: 0px;
      border-collapse: collapse;
    }
    table, tr, td {
      border-bottom: 0;
    }
    hr {
      border-top: 1px dashed black;
    }
    tr.bt {
      border-top: 1px dashed black;
      border-bottom: 0px;
    }
    tr {
      padding-top: -5px;
    }



  </style>`

  printreceipt() {
    // console.log(this.item.product,this.products);

    var printtemplate = `
    <div id="printelement">
    <div class="header">
    <h2>${this.loginfo.name}</h2>
    <strong>Purchase List</strong>
    <div hidden class="header">

        <h3 hidden></h3>
    </div>
    <hr>
     <h2 style="font-size:15px">Vendor: ${this.selected_order.vendorName} <h2/>
   <h2 style="font-size:15px">Address : ${this.selected_order.vendorAddress} <h2/>
   <h2 style="font-size:15px">Phone   : ${this.selected_order.vendorNumber} <h2/>
   <hr>
    <table class="item-table">
        <thead class="nb">
            <th class="text-left" style="width: 100px;">ITEM</th>
            <th>PRICE</th>
            <th>QTY</th>
            <th class="text-right">AMOUNT</th>
        </thead>
        <tr>

      </tr>
        <tbody>`
    this.selected_order.items.forEach(it => {
      printtemplate += `<tr class="nb">
                            <td class="text-left">${it.productName}</td>
                            <td>${it.productPrice}</td>
                            <td>${it.productQty}</td>
                            <td class="text-right">${it.billAmount}</td>
                        </tr>`
    });
    printtemplate += `
    <tr class="bt">
        <td class="text-left"><strong>Sub Total</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.selected_order.paidamount}</td>
    </tr>
    <tr class="nb" hidden>
        <td class="text-left"><strong>Discount</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.selected_order.DiscAmount}</td>
    </tr>
    <tr class="nb" >
        <td class="text-left"><strong>CGST</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.selected_order.productTax}</td>
    </tr>

          <tr class="nb">
              <td class="text-left"><strong>Paid</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${this.selected_order.paidamount}</td>
          </tr>
          <tr class="nb">
              <td class="text-left"><strong>Total</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${this.selected_order.billamount + this.selected_order.productTax}</td>
          </tr>

        </tbody>
      </table>
      <hr>
      <div class="text-center">
      <strong style="margin-left:30px;font-size:15px">Powered By BizDom.</strong>
      </div>
    </div>`
    printtemplate += this.printhtmlstyle
    console.log(printtemplate)
    if (this.printersettings)
      this.printservice.print(printtemplate, [this.printersettings.receiptprinter])
  }





}
