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
  selector: 'app-purchasebill',
  templateUrl: './purchasebill.component.html',
  styleUrls: ['./purchasebill.component.scss']
})
export class PurchasebillComponent implements OnInit {
  isShown = true;
  isTable =false;
  EditTable = false;
  DetailTable = false;
  users = [];
  CompanyId =1;
  stores :any= [];
  billData: any =[];
  paymentTypes:any =[];
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
  billtype ='';
  items:any =[];
  bankAccountId = null;
  accTypeId =null;
  isActive = true;
  bankName ="";
accountData:any =[];
label = false;
  // trans =[];
  trans: any = {   amount: 0, creditTypeStatus:"", PaymentTypeId:null, paystore:"",accountNo:null,
  Description: "", CompanyId: 1,contactId:this.contactId,responsibleById:this.DispatchById,
  storeId:this.SuppliedById, contactType:0,TransactionId:null,BillPayId:null,billId:null,
  paytmode:"",Totalbalancebefore:null,Totalbalanceafter:null,BankAccountId:null,
  billDate:'',
  //  TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),
  //  TransDate:moment().format('YYYY-MM-DD HH:MM\ A'),
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
    this.getbillpayData();
this.getPaymentTypesList();
this.getBankAccts();
  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
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

  updquery()
{
  this.trans.bill.forEach(element => {
    element["Pay"] = this.trans.amount; 
    element["OldPaid"] = this.trans.Totalbalancebefore; 
    element["OldPay"] = this.trans.Totalbalanceafter; 
    element["BillPayId"] = this.trans.BillPayId; 
    element["BillId"] = this.trans.billId; 
                                                                                                                                               
  })

}
paymttype()
{
  console.log("this.accountData",this.accountData.id)
if(this.trans.PaymentTypeId == 2)
{
  this.label = true;
  this.trans.BankAccountId = null;
}
}

  getbillpayData() {
    var x = new Date();
    x.setDate(1);
    x.setMonth(x.getMonth() - 1);
    console.log("fromdate",x)
    this.Ordprd.push({
      companyId:this.CompanyId,
      transactionId:this.ordId,
       UserID:this.users[0].id,
       searchContactId:this.searchContactId,
      numRecords:this.numRecords,
      dateFrom:x
    })
    this.Auth.getbillpay(this.Ordprd).subscribe(data => {
      this.billData = data;
      this.filteredvalues = this.billData.ord;
      console.log("billData",this.billData)
    })                        
  }
  getPaymentTypesList() {
    this.Auth.PaymentTypesList(this.CompanyId).subscribe(data => {
      this.paymentTypes = data;
      console.log("paymentTypes", this.paymentTypes)
    })
  }

  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.billData.ord.filter(x => x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.billData;
    console.log("filtered values",this.filteredvalues)
  }
  purchasedetail(Id)
  {
    this.isShown = !this.isShown;
    this.isTable = this.isTable;
    this.EditTable = !this.EditTable;
    
    this.Auth.billdetail(Id,this.CompanyId).subscribe(data => {
      this.trans = data;
      console.log("delete",data)
      this.trans.TransactionId = this.trans.billRepays[0].transactionId;
      this.trans.paystore = this.trans.billRepays[0].transaction.store.name;
      this.trans.storeId = this.trans.billRepays[0].transaction.store.id;
      // this.trans.BillPayId =  this.trans.billRepays[0].id;
        this.trans.Description = this.trans.billRepays[0].bill.contact.name;
      this.trans.Totalbalancebefore = this.trans.balance;
      this.trans.billId = this.trans.billRepays[0].bill.billId;
      this.trans.Totalbalancepaid = this.trans.billRepays[0].bill.paidAmount;
      this.trans.Totalbalanceafter = this.trans.balanceAfter;
      this.trans.billDate = this.trans.billRepays[0].bill.billDate.slice(0,10);
      // this.trans.paytmode = this.trans.trans[0].paymentType.description;
      // this.trans.paymentTypeId = this.trans.trans[0].paymentTypeId;

      console.log("delete",data)
      })
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
  getTransList(id)
  {
    this.isShown =  !this.isShown;
    this.isTable =  !this.isTable;
    this.Auth.EditBillPay(id,this.billtype,this.CompanyId).subscribe(data => {
      this.trans = data;
      console.log("purchase",this.trans)
      this.trans.TransactionId = this.trans.trans[0].transactionId;
      this.trans.paystore = this.trans.trans[0].store.name;
      this.trans.storeId = this.trans.bill[0].storeId;
      this.trans.BillPayId =  this.trans.billRepays[0].id;
        this.trans.Description = this.trans.trans[0].contact.name;
      this.trans.Totalbalancebefore = this.trans.bill[0].billAmount;
      this.trans.billId = this.trans.bill[0].billId;
      this.trans.Totalbalancepaid = this.trans.billRepays[0].amount;
      this.trans.Totalbalanceafter = this.trans.balanceAfter;
      this.trans.paytmode = this.trans.trans[0].paymentType.description;
      this.trans.paymentTypeId = this.trans.trans[0].paymentTypeId;
      // this.trans.TransDate = moment(new Date()).format("DD/MM/YYYY")
      // this.trans.TransDateTime =  moment(new Date()).format("DD/MM/YYYY")
      this.items = this.trans.bill;
      this.trans.bill.forEach(element => {
        element["Pay"] = this.trans.amount; 
        element["OldPaid"] = this.trans.Totalbalancebefore; 
        element["OldPay"] = this.trans.Totalbalanceafter; 
        element["BillPayId"] = this.trans.BillPayId;
        element["BillId"] = this.trans.billId;                                                                                                                                                          
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
      this.getbillpayData();
  } 

  locback1()
  {
    this.isShown =  !this.isShown;
    this.EditTable = this.EditTable;
    this.isTable = !this.isTable;
  }
  locback2()
  {
    this.isShown =  !this.isShown;
    this.EditTable = !this.EditTable;
    this.isTable = this.isTable;
  }
  billpay(Id)
  {
    this.isShown =  !this.isShown;
    this.isTable =  !this.isTable; 
    this.EditTable = this.EditTable;
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
  Submit()
  {
    this.paycred.push({
      CompanyId:this.CompanyId,
      ContactId:this.contactId,
       UserId:this.users[0].id,
       ResponsibleById:this.DispatchById,
       ContactType:this.contacttype,
      CreditType:this.creditTypeStatus,
      StoreId:this.SuppliedById,
      ProviderId:this.SuppliedById,       
      Amount:this.trans.amount,
      Description:this.trans.description,
      TransDate:moment().format('YYYY-MM-DD HH:MM A'),
      CreatedDate:moment().format('YYYY-MM-DD HH:MM A'),
      TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),
      PaymentTypeId:this.paymentmode,
      PaymentStatusId:2,
      TranstypeId:8
    })
    this.Auth.Creditpay(this.paycred).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isTable =  !this.isTable;
      this.getbillpayData();
      this.notification.success("Data Updated Successfully", `Updated successfully.`)
    })
  }
  Update()
  {
    console.log("data",this.trans)
    console.log("dfdf",this.items)
    console.log("fdgdgdgdgd",this.CompanyId)
    this.paycred.push({
      trans:this.trans,
      creditArr:this.items,
      compId:this.CompanyId
    })
this.Auth.purchasepay(this.paycred).subscribe(data => {
  console.log(data)
  this.isShown = !this.isShown;
  this.isTable = !this.isTable;
  this.EditTable = this.EditTable;
})
  }
  contactType(val)
  {
    this.contacttype = val;
  }
  Delete(Id)
  {
    this.paycred.push({
      transactionId:Id,
      companyId:this.CompanyId
    })
    this.Auth.DeleteCreditpay(this.paycred).subscribe(data => {
      console.log(data)
    }) 
  }
}
      