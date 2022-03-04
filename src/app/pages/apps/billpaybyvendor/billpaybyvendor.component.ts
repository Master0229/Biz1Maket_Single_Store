import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';
import { NzNotificationService } from 'ng-zorro-antd'
import { merge, Observable, Subject } from 'rxjs';
import { Router , ActivatedRoute} from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Location } from '@angular/common';

@Component({
  selector: 'app-billpaybyvendor',
  templateUrl: './billpaybyvendor.component.html',
  styleUrls: ['./billpaybyvendor.component.scss']
})
export class BillpaybyvendorComponent implements OnInit {
  isShown = true;
  isTable =false;
  users = [];
  CompanyId =1;
  stores :any= [];
  billData: any =[];
  billstatus = '';
  searchContactId =null;
  numRecords = 50;
  ordId =null;
  Ordprd:any =[];
  OrderedById = 0;
  SuppliedById = 0;
  Accountdata =0;
  DispatchById = 0;
  contactId =0;
  orderDate ='';
  paymentmode =2;
  creditTypeStatus ="";   
  billtype:any ="";                                                                                                     
  contacttype =2;
  paycred =[];
  amt =400;
  NewArr:any =[];
  EditCredit:any =[];
  credData:any =[];
  OrdId = 0;
  isRepay = false;
  page = 2;
  term: string = '';
  type ='';
  items:any =[];
  billpay:any =[];
  bankAccountId = null;
  accTypeId =null;
  isActive = true;
  bankName ="";
accountData:any =[];
label =false;
  // trans =[];
  trans: any = {   amount: null, creditTypeStatus:"",PaymentTypeId:null, paystore:"",
   Totalbalancebefore:null,
  Description: "", CompanyId: 1,contactId:this.contactId,responsibleById:this.DispatchById,
  accountNo:null,
  storeId:this.SuppliedById, contactType:0,
   TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),
   TransDate:moment().format('YYYY-MM-DD HH:MM\ A'),
  CreatedDate:moment().format('YYYY-MM-DD HH:MM A')}
  constructor(
    private modalService: NgbModal,
     private Auth: AuthService,
    private notification: NzNotificationService,
    private router: Router ,
    private route: ActivatedRoute,
    public location: Location )
     { 
      this.users = JSON.parse(localStorage.getItem("users"));

    }

  ngOnInit(): void {
    this.getStoreList();
    this.getbillpaybyvendor();
this.getBankAccts();
  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
  }
  getbillpaybyvendor() {
    this.Ordprd.push({
      companyId:this.CompanyId,
       UserID:this.users[0].id,
       searchContactId:this.searchContactId,
      numRecords:this.numRecords
    })
    this.Auth.getbillpayvendor(this.Ordprd).subscribe(data => {
      this.billData = data;
      this.filteredvalues = this.billData.ord;
      console.log("billData",this.billData)
    })
  }
  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.billData.ord.filter(x => x.provider.toLowerCase().includes(this.term.toLowerCase()))
      : this.billData;
    console.log("filtered values",this.filteredvalues)
  }

  getBankAccts()
{
  this.Ordprd.push({
    companyId:this.CompanyId,
    numRecords:this.numRecords,
    bankAccountId:this.bankAccountId,
    accTypeId:this.accTypeId,
    isActive:this.isActive,
    bankName:this.bankName
  })
  this.Auth.getbankaccount(this.Ordprd).subscribe(data => {
    this.accountData = data;
    console.log("accountData",this.accountData)
  })
}
paymttype()
{
if(this.trans.PaymentTypeId =="2")
{
  this.label = true;
}
}

  Deletedata(id)
  {
    this.NewArr.push({
      companyId:this.CompanyId,
      TransactionId:id
    })
    this.Auth.deleteCredit(this.NewArr).subscribe(data => {
      console.log("delete",data)
      })
  }
  paybill(id,storeId,vendorId)
  {
    this.isShown =  !this.isShown;
    this.isTable =  !this.isTable; 
    this.Auth.getvendorbill(id,storeId,this.CompanyId,vendorId,this.billtype).subscribe(data => {
      this.billpay = data;  
      console.log("EditCredit",this.billpay)
      this.trans.Description = this.billpay.bill.value.bills[0].contact.name;
      this.trans.ContactId = this.billpay.bill.value.bills[0].contactId;
      this.trans.storeId = this.billpay.bill.value.bills[0].storeId;
      this.trans.Totalbalancebefore = this.billpay.bill.value.bills[0].billAmount;
      this.trans.paystore = this.billpay.bill.value.paymentStore;
      //  this.trans.Amount = 10;
      this.trans.Totalbalance = this.billpay.bill.value.balance;
      // this.trans.TransDate = moment(new Date()).format("DD/MM/YYYY")
      // this.trans.TransDateTime =  moment(new Date()).format("DD/MM/YYYY")
      this.items = this.billpay.bill.value.bills;
      this.billpay.bill.value.bills.forEach(element => {
        element["pay"] = this.trans.amount; 
        element["BillId"] = this.trans.billId;                                                                                                                                                          
        element["PayStore"] = this.trans.paystore;                                                                                                                                                                                                                                                                                                             
      })  
      })  
  }
  Billstatus(val)
  {
    console.log("val", val)
    if(val == 1)
    {
      this.billstatus ="PEN";  
    }
    if(val == 2)
    { 
      this.billstatus ="PAID";  
    }
    if(val == 3)
    {
      this.billstatus ="ALL";  
    }
    console.log("val", this.billstatus)
      this.getbillpaybyvendor();
  }   

  locback()
  {
    this.isShown =  !this.isShown;
    this.isTable =  !this.isTable;
  }
  
  onChange(e) {
    console.log("date",e);
    this.orderDate =e;
  }

  selecteddispatchitem(item) {
    console.log("item", item);
    this.DispatchById = item.id;
  }
  searchdispatch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.cusList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatterdispatch = (x: { name: string }) => x.name;

  selectedcontactitem(item) {
    console.log("item", item);
    this.contactId = item.id;
  }
  searchcontact = (text$: Observable<string>) =>
    text$.pipe(
       debounceTime(200),
      map(term => term === '' ? []
        : this.stores.cusList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattercontact = (x: { name: string }) => x.name;

  selectedsupplieritem(item) {
    console.log("item",item);
    this.SuppliedById =item.id;
  }
  searchsupplier = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.storeList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattersupplier = (x: { name: string }) => x.name;
  selectedaccountitem(item) {
    console.log("item",item);
    this.Accountdata =item.id;
  }
  searchBankAccount = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    map(term => term === '' ? []
      : this.stores.bankAcct.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

formatteraccount = (x: { name: string }) => x.name;

  recStatus(Value)
  {
    console.log("rec",Value)
this.paymentmode =Value;
  }
  creditStatus(Val)
  {
    console.log("credit",Val)
    if(Val == 1)
    {
      this.creditTypeStatus ="SALADV";  
    }
    if(Val == 2)
    {
      this.creditTypeStatus ="PURADV";  
    }
    if(Val == 3)
    {
      this.creditTypeStatus ="MANADV";  
    }
    if(Val == 4)
    {
      this.creditTypeStatus ="OTR";  
    }
    console.log("credit",this.creditTypeStatus)
    // this.creditTypeStatus = Val;
  }
  getrepayList(Id)
  {
this.isTable = this.isTable;
this.isShown = !this.isShown;
this.isRepay = !this.isRepay;
  }
  updquery()
  {
    this.billpay.bill.value.bills.forEach(element => {
      element["pay"] = this.trans.amount;                                                                                                                                                     
    })  
  }
  Submit()
  {
    this.paycred.push({
      companyId:this.CompanyId,
trans:this.trans,
creditArr:this.items,
type :this.type,
UserId:this.users[0].id
    })
    console.log("data",this.paycred)
    this.Auth.billpay(this.paycred).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isTable =  !this.isTable;
      this.getbillpaybyvendor();
    })
  }
  contactType(val)
  {
    this.contacttype = val;
  }
  billpaydetail()
  {
        this.isShown =  !this.isShown;
    this.isTable =  !this.isTable; 

  }
  Delete(Id)
  {
    this.Auth.Deletebillpay(Id,this.CompanyId).subscribe(data => {
      console.log(data)
    }) 
  }
}
        