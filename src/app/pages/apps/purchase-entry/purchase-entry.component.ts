import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core'
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service'
import { NzNotificationService } from 'ng-zorro-antd'
import { merge, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators'

@Component({
  selector: 'app-purchase-entry',
  templateUrl: './purchase-entry.component.html',
  styleUrls: ['./purchase-entry.component.scss'],
})
export class PurchaseEntryComponent implements OnInit {
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
              .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    )

  formattervendor = (x: { name: string }) => x.name

  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any> //productinput
  @ViewChild('discper', { static: false }) public discperel: TemplateRef<any>
  @ViewChild('disc', { static: false }) public discel: TemplateRef<any>
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef
  // @ViewChild('cardnumber', { static: false }) cardnumber: ElementRef;
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
  searchTerm = ''
  tax = 0
  discount = 0
  isVisible = false
  batchno = 0
  tableData = [
    {
      key: '1',
      actionName: 'New Users',
      progress: { value: 60, color: 'bg-success' },
      value: '+3,125',
    },
    {
      key: '2',
      actionName: 'New Reports',
      progress: { value: 15, color: 'bg-orange' },
      value: '+643',
    },
    {
      key: '3',
      actionName: 'Quote Submits',
      progress: { value: 25, color: 'bg-primary' },
      value: '+982',
    },
  ]
  temporaryItem = {
    Id: 0,
    product: '',
    quantity: null,
    tax: 0,
    amount: 0,
    price: null,
    Tax1: 0,
    Tax2: 0,
    barcode_Id: 0,
    disc: 0,
    taxpercent: 0,
  }
  barcodeItem = { quantity: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0 }
  barcodemode: boolean = false
  customerdetails = { data_state: '', name: '', PhoneNo: '', email: '', address: '', companyId: 1 }
  customers: any = []
  // quantityfc = new FormControl('', [Validators.required, Validators.min(1)]);

  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
  ) {}
  // getErrorMessage() {
  //   if (this.quantityfc.hasError('required')) {
  //     return "Quantity can't be Empty";
  //   }

  //   return this.quantityfc.hasError('min') ? 'Quantity should be greater than 0' : '';
  // }

  ngOnInit(): void {
    this.products = []
    this.getBarcodeProduct()
    // this.getcustomers();
    this.getVendorList()
    this.temporaryItem.quantity = null
    // this.products = JSON.parse(localStorage.getItem("Product"));
    this.products.forEach(product => {
      product.quantity = null
      product.tax = 0
      product.amount = 0
    })
  }
  getBarcodeProduct() {
    this.Auth.getBarcodeProduct(1, 0).subscribe(data => {
      console.log(data)
      this.products = data['products']
      this.batchno = data['lastbatchno'] + 1
    })
  }
  getVendorList() {
    this.Auth.getvendors(1).subscribe(data => {
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
      // this.temporaryItem.totalprice = +(this.temporaryItem.price * this.temporaryItem.quantity).toFixed(2)
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
  // getcustomers() {
  //   this.Auth.getcustomers().subscribe(data => {
  //     this.customers = data
  //   })
  // }
  savedata() {
    if (this.customerdetails.data_state == 'new') {
      this.addcustomer()
    } else if (this.customerdetails.data_state == 'old') {
      this.updatecustomer()
    }
  }
  updatecustomer() {
    this.Auth.updateCustomer(this.customerdetails).subscribe(
      data => {
        console.log(data)
        this.notification.success(
          'Customer Updated!',
          `${this.customerdetails.name} updated successfully.`,
        )
      },
      error => {
        console.log(error)
      },
      () => {
        // this.getcustomers();
      },
    )
  }
  addcustomer() {
    this.Auth.addCustomers(this.customerdetails).subscribe(
      data => {
        console.log(data)
        this.notification.success(
          'Customer Added!',
          `${this.customerdetails.name} added successfully.`,
        )
        this.customerdetails.data_state = 'old'
      },
      error => {
        console.log(error)
      },
      () => {
        // this.getcustomers();
      },
    )
  }
  ngAfterViewInit() {
    // this.scrollContainer = this.scrollFrame.nativeElement;
    // console.log(this.scrollContainer, this.scrollFrame)
    // Add a new item every 2 seconds for demo purposes
    // setInterval(() => {
    //   this.cartitems.push({});
    // }, 2000);
    // this.cardnumber.nativeElement.inputmask({"mask":"9999-9999-9999-9999"})
  }
  // getCustomer() {

  // }
  private async getCustomer() {
    // Sleep thread for 3 seconds
    console.log(this.customerdetails.PhoneNo)
    console.log(this.customers)
    this.customerdetails.data_state = 'loading'
    // await this.delay(3000);

    if (this.customers.some(x => x.PhoneNo == this.customerdetails.PhoneNo)) {
      var obj = this.customers.filter(x => x.PhoneNo == this.customerdetails.PhoneNo)[0]
      Object.keys(obj).forEach(element => {
        this.customerdetails[element] = obj[element]
      })
      this.customerdetails.data_state = 'old'
    } else {
      this.customerdetails.data_state = 'new'
    }
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  // scrollToBottom(): void {
  //   var el = document.getElementsByClassName('ant-table-body')[0]
  //   console.log(el.scrollHeight)
  //   // this.scrollContainer = this.scrollFrame.nativeElement;
  //   // console.log(this.scrollContainer, this.scrollFrame)
  //   el.scroll({
  //     top: el.scrollHeight + 1000,
  //     left: 0,
  //     behavior: 'smooth'
  //   });
  // }
  submitted: boolean = false
  addItem() {
    // this.temporaryItem.amount = this.temporaryItem.price * this.temporaryItem.quantity
    // this.temporaryItem.tax = (this.temporaryItem.Tax1 + this.temporaryItem.Tax2) * this.temporaryItem.amount / 100
    // this.temporaryItem.amount = +this.temporaryItem.amount.toFixed(2)
    // this.temporaryItem.totalprice = +(this.temporaryItem.price * this.temporaryItem.quantity).toFixed(2)
    // if (this.products.some(x => x.barcode_Id == this.temporaryItem["barcode_Id"])) {
    //   this.cartitems.filter(x => x.barcode_Id == this.temporaryItem["barcode_Id"])[0].quantity += this.temporaryItem.quantity.price += this.temporaryItem.price.disc += this.temporaryItem.disc
    // } else {
    this.submitted = true
    if (this.validation()) {
      this.cartitems.push(Object.assign({}, this.temporaryItem))
      // }
      // this.subtotal = 0;
      // this.tax = 0;
      // this.cartitems.forEach(item => {
      //   this.subtotal += item.amount
      //   this.tax += (item.amount * item.tax / 100)
      // })
      // this.subtotal = +this.subtotal.toFixed(2)
      // this.tax = +this.tax.toFixed(2)
      console.log('cartitems', this.cartitems)
      this.calculate()
      // this.inputValue = '';
      this.temporaryItem.quantity = null
      this.temporaryItem.price = null
      this.temporaryItem.disc = null

      // this.temporaryItem = { id: 0, productid: 0, product: null, price: null, quantity: null, tax: 0, discount_percent: null, discount_cash: null, totalprice: null, editMode: false }
      // this.subtotal = 0;
      // this.tax = 0;
      // this.cartitems.forEach(item => {
      //   this.subtotal += item.totalprice
      //   this.tax += (item.totalprice * item.tax / 100)
      // })
      // this.subtotal = +this.subtotal.toFixed(2)
      // this.tax = +this.tax.toFixed(2)
      // this.quantityel['nativeElement'].value = null
      this.temporaryItem = {
        Id: 0,
        quantity: null,
        taxpercent: null,
        tax: 0,
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
      // this.scrollToBottom();
      // this.quantityfc.markAsPristine();
      // this.quantityfc.markAsUntouched();
    }
  }
  // getcustomerdetails(compid) {
  //   this.Auth.getcustomers().subscribe(data => {
  //     console.log(compid)
  //   })
  // }
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
    this.cartitems[i].amount = this.cartitems[i].price * this.cartitems[i].quantity
    this.cartitems[i].tax =
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
    this.tax = 0
    this.discount = 0
    this.cartitems.forEach(item => {
      console.log(item)
      item.amount = item.price * item.quantity
      item.tax = (item.taxpercent * item.amount) / 100
      item.amount = +item.amount.toFixed(2) - item.disc
      this.subtotal += item.price * item.quantity
      this.tax += item.tax
      this.discount += item.disc
    })
    this.subtotal = +this.subtotal.toFixed(2)
    this.tax = +this.tax.toFixed(2)
    this.discount = +this.discount.toFixed(2)
    // console.log(this.tax)
  }
  date = new Date()
  onChange(e) {
    console.log(e, moment(e), this.date)
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
    this.temporaryItem.disc = 0
    Object.keys(item).forEach(key => {
      this.temporaryItem[key] = item[key]
    })
    this.quantityel['nativeElement'].focus()
  }
  selectedvendoritem(item) {
    console.log(item)
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
}
