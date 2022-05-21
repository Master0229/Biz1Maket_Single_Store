import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core'
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service'
import { NzNotificationService } from 'ng-zorro-antd'
import { merge, Observable, Subject } from 'rxjs'
import { Router, ActivatedRoute } from '@angular/router'
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'
import { Location } from '@angular/common'
@Component({
  selector: 'app-purchasemaint',
  templateUrl: './purchasemaint.component.html',
  styleUrls: ['./purchasemaint.component.scss'],
})
export class PurchasemaintComponent implements OnInit {
  isShown = true
  isTable = false
  users = []
  CompanyId = 1
  stores: any = []
  purchaseData: any = []
  billstatus = 'ALL'
  transtype = 2
  numRecords = 50
  ordId = 0
  category: any
  Ordprd: any = []
  OrderedById = 0
  SuppliedById = 0
  Accountdata = 0
  DispatchById = 0
  contactId = 0
  orderDate = ''
  paymentmode = 2
  creditTypeStatus = ' '
  contacttype = 2
  paycred = []
  amt = 400
  NewArr: any = []
  EditCredit: any = []
  credData: any = []
  OrdId = 0
  billId = null
  credit = []
  index: any
  vendors: any
  term: string = ''
  EditTable = false
  // trans =[];
  toDate = ''
  viewType = 'ID'
  accountData: any = []
  billpay: any = []
  storeId = null
  vendorId = null
  items = []
  bankAccountId = null
  accTypeId = null
  isActive = true
  bankName = ''
  type = ''
  Amount = null
  label = false
  paymentTypes: any = []
  pay: any = []
  products: any

  id: any
  companyId: any
  smodel = ''
  trans: any = {
    Amount: null,
    creditTypeStatus: '',
    PaymentTypeId: 1,
    paystore: '',
    Description: '',
    CompanyId: 1,
    ContactId: this.contactId,
    responsibleById: this.DispatchById,
    storeId: this.SuppliedById,
    contactType: 0,
    TotalBalance: null,
    pay: 10,
    accountNo: null,
    //  TransDateTime:moment(new Date()).format("DD/MM/YYYY"),
    //  TransDate:moment(new Date()).format("DD/MM/YYYY"),
    CreatedDate: new Date(),
  }
  // contactId:this.contactId,
  // responsibleById:this.DispatchById, contactType:this.contacttype,
  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    public location: Location,
  ) {
    this.users = JSON.parse(localStorage.getItem('users'))
  }

  ngOnInit(): void {
    this.getStoreList()
    this.getpurchaseData('All')
    this.getBankAccts()
    // this.getproducts()
    this.getvenderlist()
    this.getcategory()
  }

  visibleIndex = -1
  showSubItem(ind) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1
    } else {
      this.visibleIndex = ind
    }
  }

  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data['storeList']
      console.log('stores', this.stores)
    })
  }
  getpurchaseData(billstatus) {
    var x = new Date()
    x.setDate(1)
    x.setMonth(x.getMonth() - 1)
    this.Ordprd.push({
      companyId: this.CompanyId,
      searchId: this.ordId,
      UserID: this.users[0].id,
      billstatus: billstatus,
      billId: this.billId,
      numRecords: this.numRecords,
      dateFrom: x,
    })
    // console.log("billstatus",this.billstatus)
    this.Auth.getpurchmaint(this.Ordprd).subscribe(data => {
      this.purchaseData = data
      this.filteredvalues = this.purchaseData.ord
      console.log('purchaseData', this.purchaseData)
    })
  }

  filteredvalues = []
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.purchaseData.ord.filter(x => x.name1.toLowerCase().includes(this.term.toLowerCase()))
      : this.purchaseData
    console.log('filtered values', this.filteredvalues)
  }

  Deletedata(id) {
    this.NewArr.push({
      companyId: this.CompanyId,
      TransactionId: id,
    })
    this.Auth.deleteCredit(this.NewArr).subscribe(data => {
      console.log('delete', data)
    })
  }
  // trans: any = {   amount: 0, creditTypeStatus:"", PaymentTypeId:1,
  // Description: "", CompanyId: 1,contactId:this.contactId,responsibleById:this.DispatchById,
  // storeId:this.SuppliedById, contactType:0,
  billpayfor(id) {
    this.isShown = !this.isShown
    this.isTable = !this.isTable
    this.NewArr.push({
      toDate: this.toDate,
      viewType: this.viewType,
      companyId: this.CompanyId,
      storeId: this.storeId,
      vendorId: id,
      numRecords: this.numRecords,
    })
    this.Auth.billpayfor(this.NewArr).subscribe(data => {
      this.billpay = data
      console.log('data', this.billpay)
      this.trans.ContactId = this.billpay.bills.value.contactId
      this.trans.Description = this.billpay.bills.value.bills[0].name
      this.trans.storeId = this.billpay.bills.value.bills[0].providerId
      //  this.trans.Amount = 10;
      this.trans.Totalbalance = this.billpay.bills.value.balance
      // this.trans.TransDate = moment(new Date()).format("DD/MM/YYYY")
      // this.trans.TransDateTime =  moment(new Date()).format("DD/MM/YYYY")
      this.items = this.billpay.bills.value.bills
      this.billpay.bills.value.bills.forEach(element => {
        element['pay'] = this.trans.pay
      })
      var totalamount = 20000
      for (let i = 0; i < this.billpay.bills.value.bills.length; i++) {
        //  this.trans.Amount = this.trans.pay;
        this.trans.pay = 10
      }
    })
    //   this.trans.TotalBalance = this.trans.TotalBalance + this.billpay.bills.value.bills[i].pendAmount;
    //   console.log("ta",totalamount, this.billpay.bills.value.bills[i].pendAmount)
    //   if (totalamount > this.billpay.bills.value.bills[i].pendAmount) {
    //     this.billpay.bills[i].value.bills.pay = this.billpay.bills.value.bills[i].pendAmount;
    //     totalamount -= this.billpay.bills.value.bills[i].pendAmount
    //   } else if (totalamount > 0) {
    //     this.billpay.bills.value.bills[i].pay = totalamount;
    //     totalamount = 0
    //   } else
    //     this.billpay.bills.value.bills[i].pay = 0;
    //    console.log(this.billpay .bills.value.bills[i].pay)
    // }
  }
  updquery() {
    this.billpay.bills.value.bills.forEach(element => {
      element['pay'] = this.trans.Amount
    })
  }
  paymttype() {
    if (this.trans.PaymentTypeId == '2') {
      this.label = true
    }
  }
  getBankAccts() {
    this.Ordprd.push({
      companyId: this.CompanyId,
      numRecords: this.numRecords,
      bankAccountId: this.bankAccountId,
      accTypeId: this.accTypeId,
      isActive: this.isActive,
      bankName: this.bankName,
    })
    this.Auth.getbankaccount(this.Ordprd).subscribe(data => {
      this.accountData = data
      console.log('accountData', this.accountData)
    })
  }

  Billstatus(val) {
    console.log('val', val)
    if (val == 1) {
      this.billstatus = 'PEN'
    }
    if (val == 2) {
      this.billstatus = 'PAID'
    }
    if (val == 3) {
      this.billstatus = 'ALL'
    }
    console.log('val', this.billstatus)
    this.getpurchaseData(this.billstatus)
  }

  locback1() {
    this.isShown = !this.isShown
    this.EditTable = this.EditTable
    this.isTable = !this.isTable
  }
  locback2() {
    this.isShown = !this.isShown
    this.EditTable = !this.EditTable
    this.isTable = this.isTable
  }

  onChange(e) {
    console.log('date', e)
    this.orderDate = e
  }

  selecteddispatchitem(item) {
    console.log('item', item)
    this.DispatchById = item.id
  }
  searchdispatch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.stores.cusList
              .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    )

  formatterdispatch = (x: { name: string }) => x.name

  selectedcontactitem(item) {
    console.log('item', item)
    this.contactId = item.id
  }
  searchcontact = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.stores.cusList
              .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    )

  formattercontact = (x: { name: string }) => x.name

  selectedsupplieritem(item) {
    console.log('item', item)
    this.SuppliedById = item.id
  }
  searchsupplier = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.stores.storeList
              .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    )

  formattersupplier = (x: { name: string }) => x.name
  selectedaccountitem(item) {
    console.log('item', item)
    this.Accountdata = item.id
  }
  searchBankAccount = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.stores.bankAcct
              .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    )

  formatteraccount = (x: { name: string }) => x.name

  recStatus(Value) {
    console.log('rec', Value)
    this.paymentmode = Value
  }
  creditStatus(Val) {
    console.log('credit', Val)
    this.creditTypeStatus = Val
  }

  Submit() {
    // this.items[0].push({pay : this.trans.pay})

    this.paycred.push({
      companyId: this.CompanyId,
      creditArr: this.items,
      trans: this.trans,
      type: this.type,
      UserId: this.users[0].id,
    })
    console.log('data', this.paycred)
    this.Auth.billpay(this.paycred).subscribe(data => {
      console.log(data)
      this.isShown = !this.isShown
      this.EditTable = !this.EditTable
      this.isTable = this.isTable
    })
  }
  contactType(val) {
    this.contacttype = val
  }
  Delete(Id) {
    this.paycred.push({
      transactionId: Id,
      companyId: this.CompanyId,
    })
    this.Auth.DeleteCreditpay(this.paycred).subscribe(data => {
      console.log(data)
    })
  }
  purchasedetail(billId) {
    this.isShown = !this.isShown
    this.isTable = this.isTable
    this.EditTable = !this.EditTable
    this.NewArr.push({
      toDate: this.toDate,
      viewType: this.viewType,
      companyId: this.CompanyId,
      storeId: this.storeId,
      vendorId: billId,
      numRecords: this.numRecords,
    })
    this.Auth.billpayfor(this.NewArr).subscribe(data => {
      this.billpay = data
      console.log('data', this.billpay)
      this.trans.ContactId = this.billpay.bills.value.contactId
      this.trans.Description = this.billpay.bills.value.bills[0].name
      this.trans.storeId = this.billpay.bills.value.bills[0].providerId
      this.trans.TotalBalance = this.billpay.bills.value.balance
      this.trans.paystore = this.billpay.bills.value.paymentStore
    })
  }

  // getproducts() {
  //   this.Auth.getProduct(this.id, this.loginfo.companyId, this.strdate, this.enddate,).subscribe(data => {
  //     this.products = data['products']
  //     console.log(this.products)
  //   })
  // }

  getvenderlist() {
    this.Auth.getvendors((this.companyId = 1)).subscribe(data => {
      this.vendors = data
      console.log(this.vendors)
    })
  }

  getcategory() {
    this.Auth.getcategories((this.companyId = 1), 'A').subscribe(data => {
      this.category = data
      console.log(this.category)
    })
  }

  arrayName: string
  searchField: string

  search = (text$: Observable<string>) =>
    text$.pipe(
      map(term =>
        term === ''
          ? []
          : this.products.products
              .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    )
  c_search = (text$: Observable<string>) => {
    return text$.pipe(
      map(term =>
        term === ''
          ? []
          : this[this.arrayName]
              .filter(v => v[this.searchField].toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    )
  }

  formatter = (x: { name: string }) => x.name

  selectedItem(product) {
    console.log(product)
    // this.storeId = product.Id
  }

  openDetailpopup(contentdetail) {
    const modalRef = this.modalService
      .open(contentdetail, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        result => {},
        reason => {},
      )
  }
}
