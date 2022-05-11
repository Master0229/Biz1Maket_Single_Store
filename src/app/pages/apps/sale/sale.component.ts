import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core'
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service'
import { NzNotificationService } from 'ng-zorro-antd'
import { Observable } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import { OrderItemModule, OrderModule, AdditionalCharge, Transaction } from './sale.module'
import { SyncService } from 'src/app/services/sync/sync.service'
import { PrintService } from 'src/app/services/print/print.service'
import { select, Store } from '@ngrx/store'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export class SaleComponent implements OnInit {
  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any> //productinput
  @ViewChild('discper', { static: false }) public discperel: TemplateRef<any>
  @ViewChild('disc', { static: false }) public discel: TemplateRef<any>
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef
  buffer = ''
  model: any = 'QWERTY'
  order: OrderModule
  orderItem: OrderItemModule
  paymenttypeid = 1
  isuppercase: boolean = false
  OrderNo
  loginfo
  isDisable = false
  charges = []
  deliverydate
  deliverytime
  transactionlist: Array<Transaction> = null
  issplitpayment: boolean = false
  name: any
  phoneNo: any
  city: any
  address: any
  OrderedDateTime: any
  preferences = { ShowTaxonBill: true }
  AdditionalCharges: any
  Total: any
  CompanyId: any
  StoreId: any

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let data = this.buffer || ''
    if (event.key !== 'Enter' && event.key !== 'Shift') {
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
    console.log(this.isuppercase)
  }
  scrollContainer: any
  products: any
  product: any
  showname: any
  groupedProducts = []
  filteredvalues = []
  paymentTypes: any = []
  inputValue: string = ''
  barcValue: string = ''
  cartitems = []
  subtotal = 0
  searchTerm = ''
  tax = 0
  public show: boolean = false

  isVisible = false
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
  temporaryItem: any = { DiscAmount: null, Quantity: null, DiscPercent: 0 }
  barcodeItem = { quantity: null, tax: 0, amount: 0, price: 0, Tax1: 0, Tax2: 0 }
  barcodemode: boolean = false
  customerdetails = {
    id: 0,
    name: '',
    phoneNo: '',
    email: '',
    address: '',
    storeId: 0,
    companyId: 0,
    datastatus: ''
  }
  @Input() sectionid: number = 0
  customers: any = []
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.groupedProducts
            .filter(
              v =>
                (v.product.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                  v.barCode?.toLowerCase().indexOf(term.toLowerCase()) > -1) &&
                v.quantity > 0 && !this.barcodeMode,
            )
            .slice(0, 10),
      ),
    )

  formatter = (x: { product: string }) => x.product
  user: any
  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private sync: SyncService,
    config: NgbModalConfig,
    private printservice: PrintService,
    private store: Store<any>,
  ) {
    config.backdrop = 'static'
    config.keyboard = false
    this.user = JSON.parse(localStorage.getItem('user'))
  }

  orderkey = { orderno: 1, timestamp: 0, GSTno: '' }

  ngOnInit(): void {
    this.getData()
    // this.orderkey = localStorage.getItem('orderkey')
    //   ? JSON.parse(localStorage.getItem('orderkey'))
    //   : { orderno: 1, timestamp: 0, GSTno: '' }
    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.order = new OrderModule(6)
      this.sync.sync()
      this.products = []
      this.getproducts()
      this.getcustomers()
      this.GetStorePaymentType()
      this.temporaryItem.Quantity = null
      this.products.forEach(product => {
        product.Quantity = null
        product.tax = 0
        product.amount = 0
      })
      this.customerdetails = {
        id: 0,
        name: '',
        phoneNo: '',
        email: '',
        address: '',
        storeId: this.StoreId,
        companyId: this.CompanyId,
        datastatus: '',
      }
      if (localStorage.getItem('draftOrders')) {
        this.draftOrders = JSON.parse(localStorage.getItem('draftOrders'))
      } else {
        localStorage.setItem('draftOrders', '[]')
      }
    })
  }

  updateorderno() {
    this.orderkey.orderno++
    localStorage.setItem('orderkey', JSON.stringify(this.orderkey))
    this.Auth.updateorderkey(this.orderkey).subscribe(data => {
      console.log(data)
    })
    console.log(this.orderkey)
  }

  getproducts() {
    this.Auth.getproducts().subscribe(data => {
      this.products = data
      console.log(this.products)
      this.products.forEach(prod => {
        prod.maxqty = prod.quantity
      })
      this.groupProduct()
    })
  }

  orderlogging(eventname) {
    console.log(this.orderkey.orderno)
    var logdata = {
      event: eventname,
      orderjson: JSON.stringify(this.order),
      ordertypeid: this.order.OrderTypeId,
      orderno: this.orderkey.orderno,
      timestamp: new Date().getTime(),
    }
    this.Auth.logorderevent(logdata).subscribe(data => {

      console.log(data)
    })

    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      // if(this.stockchnageid != state.stockchnageid) {
      this.getData()
      // }
    })

  }
  getData() {
    this.Auth.getdbdata(['loginfo', 'printersettings', 'orderkeydb', 'additionalchargesdb']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.printersettings = data['printersettings'][0]
      this.orderkey = data["orderkeydb"][0]
      this.charges = data["additionalchargesdb"]
      localStorage.setItem('orderkey', JSON.stringify(this.orderkey))
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      this.orderkeyValidation()
      console.log(this.loginfo)
    })

  }

  createorder(ordertypeid) {
    this.order = new OrderModule(ordertypeid)
    this.order.createdtimestamp = new Date().getTime()
    this.charges.forEach(charge => {
      this.order.additionalchargearray.push(new AdditionalCharge(charge))
    })
    if (![2, 3, 4].includes(this.order.OrderTypeId)) {
      this.order.additionalchargearray.forEach(charge => {
        charge.selected = false
      })
    }
    this.order.StoreId = this.loginfo.storeId
    this.orderlogging('create_order')
    this.show = false
    this.sectionid = 2
    if (this.order.IsAdvanceOrder || this.order.OrderTypeId == 2) {
      this.deliverydate = moment().format('YYYY-MM-DD')
      this.deliverytime = moment().format('HH:MM')
    }
  }

  groupProduct() {
    var helper = {}
    this.groupedProducts = this.products.reduce((r, o) => {
      var key = o.barcodeId + '-'
      if (!helper[key]) {
        helper[key] = Object.assign({}, o) // create a copy of o
        r.push(helper[key])
      }
      return r
    }, [])
    console.log(this.groupedProducts)
  }
  barcodeMode: boolean = false
  setproductbybarcode(code) {
    this.barcodeMode = false
    console.log(code, this.products.filter(x => x.barCode == code));
    var product = this.products.filter(x => x.barCode == code && x.quantity > 0)[0];
    if (product) {
      console.log(product);
      this.temporaryItem = product;
      this.temporaryItem.Quantity = 1;
      this.temporaryItem.DiscAmount = 0
      this.addItem("barcodereader")
    }
  }

  getcustomers() {
    this.Auth.getcustomers().subscribe(data => {
      this.customers = data
      console.log(data)
    })
  }
  savedata() {
    this.addcustomer()
  }
  updatecustomer() {
    Object.keys(this.order.CustomerDetails).forEach(key => {
      this.customerdetails[key.charAt(0).toLowerCase() + key.slice(1)] = this.order.CustomerDetails[
        key
      ]
    })
    this.Auth.updateCustomerdb(this.customerdetails).subscribe(
      data => {
        this.notification.success(
          'Customer Updated!',
          `${this.order.CustomerDetails.Name} updated successfully.`,
        )
      },
      error => { },
      () => {
        this.getcustomers()
      },
    )
  }

  // Create New Customer
  addcustomer() {
    Object.keys(this.order.CustomerDetails).forEach(key => {
      this.customerdetails[key.charAt(0).toLowerCase() + key.slice(1)] = this.order.CustomerDetails[
        key
      ]
    })
    this.Auth.addCustomerdb(this.customerdetails).subscribe(
      data => {
        // this.notification.success(
        //   'Customer Added!',
        //   `${this.order.CustomerDetails.Name} added successfully.`,
        // )
        // this.order.CustomerDetails.datastatus = 'old'
      },
      error => { },
      () => {
        this.getcustomers()
      },
    )
  }

  // Get Customers
  private async getCustomer() {
    this.order.CustomerDetails.datastatus = 'loading'
    if (this.customers.some(x => x.phoneNo == this.order.CustomerDetails.PhoneNo)) {
      var obj = this.customers.filter(x => x.phoneNo == this.order.CustomerDetails.PhoneNo)[0]
      console.log(obj)
      this.order.CustomerId = obj.id
      Object.keys(this.order.CustomerDetails).forEach(key => {
        this.order.CustomerDetails[key] = obj[key.charAt(0).toLowerCase() + key.slice(1)]
      })
      console.log(this.order.CustomerDetails)
      this.order.CustomerDetails.datastatus = 'old'
    } else {
      this.order.CustomerDetails.datastatus = 'new'
    }
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  scrollToBottom(): void {
    var el = document.getElementsByClassName('ant-table-body')[0]
    el.scroll({
      top: el.scrollHeight + 1000,
      left: 0,
      behavior: 'smooth',
    })
  }

  filterAutoComplete() {
    this.filteredvalues = this.products.filter(x =>
      x.product.toLowerCase().includes(this.inputValue),
    )
  }
  fieldselect(event) {
    var product = this.products.filter(x => x.barcodeId == +event.element.nativeElement.id)[0]
    this.inputValue = product.product
    this.temporaryItem = product
  }

  submitted: boolean = false
  batches: any = [];
  batchno = 0;
  addItem(from) {
    this.submitted = true
    this.barcodeMode = false
    if (this.validation()) {
      if (this.order.Items.some(x => x.stockBatchId == this.temporaryItem['stockBatchId'])) {
        this.order.Items.filter(x => x.stockBatchId == this.temporaryItem['stockBatchId'],)[0].OrderQuantity += this.temporaryItem.Quantity
        this.order.setbillamount()
      } else {
        this.order.addproduct(this.temporaryItem, this.showname)
      }
      this.products.forEach(product => {
        if (product.stockBatchId == this.temporaryItem['stockBatchId']) {
          product.quantity -= this.temporaryItem.Quantity
          Object.keys(product).forEach(key => {
            this.temporaryItem[key] = product[key]

          })
        }
      })


      this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0 }
      if (from == "user")
        this.productinput['nativeElement'].focus()
      this.model = ''
      this.filteredvalues = []
      this.submitted = false
      this.groupProduct()
      return
    }

  }

  getcustomerdetails(compid) {
    this.Auth.getcustomers().subscribe(data => {
      console.log(compid)
    })
  }
  barcodereaded(event) {
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
    this.barcodeItem = { quantity: null, tax: 0, amount: 0, price: 0, Tax1: 0, Tax2: 0 }
    this.barcValue = ''
  }
  quantitychange(Items: OrderItemModule, event) {

    console.log(Items, event)

    console.log(this.products)
    var prod = this.products.filter(x => x.stockBatchId == Items.stockBatchId)[0]
    console.log(Items.OrderQuantity, prod.maxqty)
    console.log(this.products)

    if (Items.OrderQuantity && Items.OrderQuantity <= prod.maxqty) {
      console.log('%c GOOD! ', 'color: #bada55')
      this.products.filter(x => x.stockBatchId == Items.stockBatchId)[0].quantity = prod.maxqty - Items.OrderQuantity
      this.order.setbillamount()
    } else if (Items.OrderQuantity == 0 || Items.OrderQuantity == null) {
      event.preventDefault()
      console.log('%c VERY LOW! ', 'color: orange')
      Items.OrderQuantity = 1
      this.products.filter(x => x.stockBatchId == Items.stockBatchId)[0].quantity = prod.maxqty - 1
      this.order.setbillamount()
    } else {
      event.preventDefault()
      console.log('%c EXCEED! ', 'color: red')
      Items.OrderQuantity = 1
      this.products.filter(x => x.stockBatchId == Items.stockBatchId)[0].quantity = prod.maxqty - 1
      this.order.setbillamount()
    }
    // this.addItem()
    console.log(Items.OrderQuantity)
  }
  delete(index) {
    this.products.forEach(prod => {
      if (prod.stockBatchId == this.order.Items[index].stockBatchId) {
        prod.quantity += this.order.Items[index].OrderQuantity
      }
    })
    this.order.Items.splice(index, 1)
    this.order.setbillamount()
  }
  clearallorders() {
    this.order = new OrderModule(6)
    this.clearDraftOrder()
  }
  clearDraftOrder() {
    if (this.selectedDraftIndex > -1) {
      this.draftOrders.splice(this.selectedDraftIndex, 1)
      this.draftOrders.forEach((dorder, ind) => {
        dorder.draftIndex = ind
      })
      localStorage.setItem('draftOrders', JSON.stringify(this.draftOrders))
      this.selectedDraftIndex = -1
    }
  }
  settotalprice(i, qty) {
    this.cartitems[i].amount = this.cartitems[i].price * this.cartitems[i].quantity
    this.cartitems[i].tax =
      (this.cartitems[i].amount * (this.cartitems[i].Tax1 + this.cartitems[i].Tax2)) / 100
    this.cartitems[i].amount = +this.cartitems[i].amount.toFixed(2)
    this.calculate()
  }
  calculate() {
    this.subtotal = 0
    this.tax = 0
    this.cartitems.forEach(item => {
      item.amount = item.price * item.quantity
      item.tax = ((item.Tax1 + item.Tax2) * item.amount) / 100
      item.amount = +item.amount.toFixed(2)
      this.subtotal += item.amount
      this.tax += item.tax
    })
    this.subtotal = +this.subtotal.toFixed(2)
    this.tax = +this.tax.toFixed(2)
  }
  date = new Date()
  onChange(e) {
    console.log(e, moment(e), this.date)
  }
  showModal(): void {
    this.isVisible = true
  }

  handleOk(): void {
    this.isVisible = false
  }

  handleCancel(): void {
    this.isVisible = false
  }
  openCustomClass(content) {
    this.modalService.open(content, { centered: true })
  }
  opensplit(content) {
    this.modalService.open(content, { centered: true })
  }
  ////////////////////////////////////////dfgdfhsfhgj?//////////////////////////////////
  batchproduct: any = []
  selectedItem(batchproduct, barcodeId) {
    this.batchproduct = this.products.filter(x => x.barcodeId == barcodeId && x.quantity > 0)
    if (this.batchproduct.length > 1) {
      this.modalService.open(batchproduct, { centered: true })
    } else {
      this.selectedproduct(this.batchproduct[0])
    }
    this.quantityel['nativeElement'].focus()

  }
  selectedproduct(product) {
    console.log(product)
    Object.keys(product).forEach(key => {
      this.temporaryItem[key] = product[key]
    })
    this.modalService.dismissAll()
    // this.addItem()
  }
  validation() {
    var isvalid = true
    if (this.temporaryItem.Quantity <= 0) isvalid = false
    if (this.temporaryItem.Quantity > this.temporaryItem.Quantity) isvalid = false
    return isvalid
  }

  orderkeyValidation() {
    var todate = new Date().getDate()
    var orderkeydate = new Date(this.orderkey.timestamp).getDate()
    var ls_orderkey = JSON.parse(localStorage.getItem('orderkey'))
    if (ls_orderkey) var ls_orderkeydate = new Date(ls_orderkey.timestamp).getDate()
    var orderkey_obj: any = {}
    if (ls_orderkey && ls_orderkey.timestamp > this.orderkey.timestamp) {
      orderkey_obj = ls_orderkey
    } else {
      orderkey_obj = this.orderkey
    }
    if (new Date(orderkey_obj.timestamp).getDate() != todate) {
      // orderkey_obj.kotno = 1
      orderkey_obj.orderno = 1
    }
    orderkey_obj.timestamp = new Date().getTime()
    this.orderkey = orderkey_obj
    localStorage.setItem('orderkey', JSON.stringify(this.orderkey))
    this.Auth.updateorderkey(this.orderkey).subscribe(d => { })
  }

  temporder: OrderModule = null
  transaction: Transaction
  currentitem: OrderItemModule = null

  // splitpayment() {
  //   this.transactionlist = []
  //   this.issplitpayment = true
  //   this.paymentTypes.forEach(pt => {
  //     var transaction = new Transaction()
  //     transaction = new Transaction()
  //     transaction.Remaining = this.temporder.BillAmount - this.temporder.PaidAmount
  //     transaction.Amount = 0
  //     transaction.OrderId = this.temporder.OrderId
  //     transaction.StoreId = this.loginfo.storeId
  //     transaction.TransDate = moment().format('YYYY-MM-DD')
  //     transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm')
  //     transaction.TranstypeId = 1
  //     transaction.UserId = this.temporder.UserId
  //     transaction.CompanyId = this.temporder.CompanyId
  //     transaction.CustomerId = this.temporder.CustomerDetails.Id
  //     transaction.StorePaymentTypeName = pt.Description
  //     transaction.StorePaymentTypeId = pt.Id
  //     this.transactionlist.push(transaction)
  //   })
  // }

  // saveOrder
  saveOrder() {
    console.log(this.order)
    this.order.OrderNo = this.orderkey.orderno
    this.order.BillDate = moment().format('YYYY-MM-DD HH:mm A')
    this.order.CreatedDate = moment().format('YYYY-MM-DD HH:mm A')
    this.order.BillDateTime = moment().format('YYYY-MM-DD HH:mm A')
    this.order.OrderedDate = moment().format('YYYY-MM-DD HH:mm A')
    this.order.OrderedDateTime = moment().format('YYYY-MM-DD hh:mm A')
    this.order.DeliveryDateTime = moment().format('YYYY-MM-DD HH:mm A')
    this.order.ModifiedDate = moment().format('YYYY-MM-DD HH:mm A')
    this.order.InvoiceNo = this.loginfo.storeId + moment().format('YYYYMMDD') + '/' + this.order.OrderNo
    this.updateorderno()
    console.log(this.order.InvoiceNo)
    this.order.CompanyId = this.loginfo.companyId
    this.order.StoreId = this.loginfo.storeId
    this.order.CustomerDetails.CompanyId = this.loginfo.companyId
    this.order.CustomerDetails.StoreId = this.loginfo.storeId
    this.order.OrderedById = 18
    this.order.ProdStatus = '1'
    this.order.WipStatus = '1'
    this.order.SuppliedById = 12
    this.order.UserId = this.user.id
    if (this.order.PaidAmount > 0) {
      if (this.order.StorePaymentTypeId != -1) {
        var transaction = new Transaction(this.order.PaidAmount, this.order.StorePaymentTypeId)
        transaction.StorePaymentTypeId = this.order.StorePaymentTypeId
        transaction.OrderId = this.order.OrderId
        transaction.CustomerId = this.order.CustomerDetails.Id
        transaction.TranstypeId = 1
        transaction.PaymentStatusId = 0
        transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
        transaction.TransDate = moment().format('YYYY-MM-DD')
        transaction.UserId = this.order.UserId
        transaction.CompanyId = this.loginfo.companyId
        transaction.StoreId = this.loginfo.storeId
        transaction.InvoiceNo = this.order.InvoiceNo
        transaction.saved = true
        transaction.StorePaymentTypeName = this.storePaymentTypes.filter(
          x => x.id == transaction.StorePaymentTypeId,
        )[0].name
        this.transaction = transaction
        this.order.Transactions.push(this.transaction)
      } else if (this.order.StorePaymentTypeId == -1) {
        this.transactionlist = this.transactionlist.filter(x => x.Amount > 0)
        this.transactionlist.forEach(trxn => {
          trxn.InvoiceNo = this.order.InvoiceNo
          trxn.CompanyId = this.order.CompanyId
          trxn.StoreId = this.loginfo.storeId
          trxn.saved = true
          this.order.Transactions.push(trxn)
        })
      }
      this.order.StorePaymentTypeName = this.order.Transactions[0].StorePaymentTypeName
      this.printreceipt()
    }
    console.log(this.order.CustomerDetails)
    localStorage.setItem('lastorder', JSON.stringify(this.order))
    this.Auth.saveordertonedb(this.order).subscribe(data => {
      console.log(data)
      this.sync.sync()
      this.order = new OrderModule(6)

    })
    this.addcustomer()
    this.notification.success('Ordered Saved successfully!', `Ordered Saved successfully.`)
    this.clearallorders()
  }
  syncDB() {
    this.Auth.getstoredata(this.CompanyId, this.StoreId, 1).subscribe(data1 => {
      console.log(data1)
      this.Auth.getstoredatadb(data1).subscribe(d => { })
    })
  }
  crossclick() {
    this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0 }
    this.productinput['nativeElement'].focus()
    this.model = ''
    this.filteredvalues = []
    this.submitted = false
  }
  selectedDraftIndex: number = -1
  draftOrders = []

  draftOrder() {
    let draftOrders = JSON.parse(localStorage.getItem('draftOrders'))
    console.log(this.draftOrder);

    let draftOrder = {
      order: this.order,
      draftIndex: draftOrders.length,
      draftName: '₹ ' + this.order.BillAmount + ' /-',
    }
    if (this.selectedDraftIndex == -1) {
      draftOrders.push(draftOrder)
    } else {
      draftOrder.draftIndex = this.selectedDraftIndex
      draftOrders[this.selectedDraftIndex] = draftOrder
    }
    this.draftOrders = draftOrders
    localStorage.setItem('draftOrders', JSON.stringify(draftOrders))
    this.selectedDraftIndex = -1
    this.clearallorders()
    console.log(draftOrder);

  }
  loadDraftOrder(dorder) {
    this.selectedDraftIndex = dorder.draftIndex
    for (var k in dorder.order) this.order[k] = dorder.order[k]
    console.log(dorder, this.order)
  }

  getcustomer() {
    this.Auth.getCustomerByPhone(this.order.CustomerDetails.PhoneNo).subscribe(data => {
      var customer: any = data[0]
      if (customer) {
        for (var key in this.order.CustomerDetails) this.order.CustomerDetails[key] = customer[key]
        this.savedata()
      }
    })
  }

  storePaymentTypes: any = []
  GetStorePaymentType() {
    this.Auth.getstorepaymentType(this.loginfo.storeId).subscribe(data => {
      console.log(data)
      this.storePaymentTypes = data
    })
  }

  // print order

  printersettings = { receiptprinter: '' }
  printhtmlstyle = `
  <style>
    #printelement {
      width: 270px;
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

  getcustomerhtml() {
    var html = ''
    if (this.order.CustomerDetails.PhoneNo) {
      html = `<div ${this.order.CustomerDetails.PhoneNo ? '' : 'hidden'} class="header">
          <h3 ${this.order.CustomerDetails.Name ? '' : 'hidden'}>${this.order.CustomerDetails.Name
        }</h3>
          <p>${this.order.CustomerDetails.Address ? this.order.CustomerDetails.Address + '<br>' : ''
        }${this.order.CustomerDetails.City ? this.order.CustomerDetails.City + ',' : ''}${this.order.CustomerDetails.PhoneNo
        }</p>
      </div>
      <hr>`
    }
    return html
  }

  printreceipt() {
    // console.log(this.order.AllItemDisc, this.order.AllItemTaxDisc, this.order.AllItemTotalDisc)
    console.log(
      this.order.OrderDiscount,
      this.order.OrderTaxDisc,
      this.order.OrderTotDisc,
      this.order.InvoiceNo,
    )
    this.orderlogging('receipt_print')
    console.log(this.order.InvoiceNo)
    var printtemplate = `
    <div id="printelement">
    <div class="header">
        <h3>${this.loginfo.name}</h3>
        <p>
            ${this.loginfo.store}, ${this.loginfo.address}<br>
            ${this.loginfo.city}, ${this.loginfo.phoneNo}
            GSTIN:${this.orderkey.GSTno}<br>
            Receipt:${this.order.InvoiceNo}<br>
            ${moment(this.order.OrderedDateTime).format("LLL")}
        </p>
    </div>
    <hr>
    ${this.getcustomerhtml()}
    <table class="item-table">
        <thead class="nb">
            <th class="text-left" style="width: 100px;">ITEM</th>
            <th class="text-right">PRICE</th>
            <th class="text-right">QTY</th>
            <th class="text-right">AMOUNT</th>
        </thead>
        <tr>
      </tr>
        <tbody>`
    var extra = 0
    this.order.Items.forEach(item => {
      printtemplate += `
      <tr class="nb">
          <td class="text-left">${item.ProductName}</td>
          <td class="text-right">${item.Price.toFixed(2)}</td>
          <td class="text-right">${item.OrderQuantity}${item.ComplementryQty > 0 ? '(' + item.ComplementryQty + ')' : ''
        }</td>
          <td class="text-right">${item.TotalAmount.toFixed(2)}</td>
      </tr>`
      extra += item.Extra
    })
    printtemplate += `
    <tr class="bt">
        <td class="text-left"><strong>Sub Total</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.order.Subtotal.toFixed(2)}</td>
    </tr>
    <tr class="nb" ${this.order.DiscAmount + this.order.AllItemTotalDisc == 0 ? 'hidden' : ''}>
        <td class="text-left"><strong>Discount</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${(+(this.order.DiscAmount + this.order.AllItemTotalDisc).toFixed(
      0,
    )).toFixed(2)}</td>
    </tr>
    <tr class="nb" ${this.order.Tax1 == 0 ? 'hidden' : ''}>
        <td class="text-left"><strong>CGST</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${(
        this.order.Tax1 +
        +((this.order.OrderTotDisc + this.order.AllItemTotalDisc) / 2).toFixed(0)
      ).toFixed(2)}</td>
    </tr>
    <tr class="nb" ${this.order.Tax2 == 0 ? 'hidden' : ''}>
        <td class="text-left"><strong>SGST</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${(
        this.order.Tax2 +
        +((this.order.OrderTotDisc + this.order.AllItemTotalDisc) / 2).toFixed(0)
      ).toFixed(2)}</td>
    </tr>`
    // this.order.additionalchargearray.forEach(charge => {
    //   if (charge.selected) {
    //     printtemplate += `
    //     <tr class="nb">
    //         <td class="text-left"><strong>${charge.Description}</strong></td>
    //         <td colspan="2"></td>
    //         <td class="text-right">${charge.ChargeValue}</td>
    //     </tr>`
    //   }
    // })
    printtemplate += `
          <tr class="nb" ${extra > 0 ? '' : 'hidden'}>
              <td class="text-left"><strong>Extra</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${extra.toFixed(2)}</td>
          </tr>
          <tr class="nb">
              <td class="text-left"><strong>Paid:-(${this.order.StorePaymentTypeName})</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${this.order.PaidAmount.toFixed(2)}</td>
          </tr>
          <tr class="nb">
              <td class="text-left"><strong>Total</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${this.order.BillAmount.toFixed(2)}</td>
          </tr>
          <tr class="nb" ${this.order.BillAmount - this.order.PaidAmount > 0 ? '' : 'hidden'}>
              <td class="text-left"><strong>Balance</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${(this.order.BillAmount - this.order.PaidAmount).toFixed(
      2,
    )}</td>
          </tr>
        </tbody>
      </table>
      <hr>
      <div class="text-center">
        <p>Powered By BizDom.</p>
      </div>
    </div>`
    printtemplate += this.printhtmlstyle
    console.log(printtemplate)
    if (this.printersettings) {
      this.printservice.print(printtemplate, [this.printersettings.receiptprinter])
    }
  }
}
