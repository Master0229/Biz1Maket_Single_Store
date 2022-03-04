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
  selector: 'app-creditrepay',
  templateUrl: './creditrepay.component.html',
  styleUrls: ['./creditrepay.component.scss']
})
export class CreditrepayComponent implements OnInit {
  isShown = true;
  isTable =false;
  users = [];
  CompanyId =1;
  stores :any= [];
  creditData: any =[];
  billstatus = 'ALL';
  transtype =2;
  numRecords = 50;
  ordId =0;
  Ordprd:any =[];
  OrderedById = 0;
  SuppliedById = 0;
  Accountdata =0;
  DispatchById = 0;
  contactId =0;
  orderDate ='';
  paymentmode =2;
  creditTypeStatus =" ";                                                                                                        
  contacttype =2;
  paycred =[];
  amt =400;
  NewArr:any =[];
  EditCredit:any =[];
  credData:any =[];
  OrdId = 0;
  transactionId = null;
  credit =[];
  repayInf:any =[];
  // trans =[];
  trans: any = {   amount: 0, creditTypeStatus:"", PaymentTypeId:1, 
  Description: "", CompanyId: 1,contactId:this.contactId,responsibleById:this.DispatchById,
  storeId:this.SuppliedById, contactType:0,
   TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),
   TransDate:moment().format('YYYY-MM-DD HH:MM\ A'),
  CreatedDate:moment().format('YYYY-MM-DD HH:MM A')}
    // contactId:this.contactId,
    // responsibleById:this.DispatchById, contactType:this.contacttype,
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
     this.getcreditrepayData();
  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
  }
  getcreditrepayData() {
    var x = new Date();
    x.setDate(1);
    x.setMonth(x.getMonth() - 1);
    console.log("fromdate",x)
    // console.log("fromdate",x.setMonth(x.getMonth() - 1))
    this.Ordprd.push({
      companyId:this.CompanyId,
      searchId:this.ordId,
       UserID:this.users[0].id,
       transtype:this.transtype,
       transactionId:this.transactionId,
      numRecords:this.numRecords,
      dateFrom:x
    })
    // console.log("billstatus",this.billstatus)
    this.Auth.getCreditrepaydata(this.Ordprd).subscribe(data => {
      this.creditData = data;
      console.log("creditData",this.creditData)
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
    this.credData.push({
      companyId:this.CompanyId,
      id:id
    })
    this.Auth.getTransdata(this.credData).subscribe(data => {
      this.trans = data;
      console.log("EditCredit",this.trans)
      })
  }

  Billstatus(val)
  {
    console.log("val",val)
    this.billstatus =val;
    //  this.getcreditrepayData();
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
    this.credits(item.id);
  }
  credits(Id)
  {
    this.Auth.getrepaydata(this.CompanyId,Id).subscribe(data => {
      this.repayInf = data;
      console.log("repayInf",this.repayInf)
      })
 
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
    this.creditTypeStatus = Val;
  }

  Submit()
  {
    this.paycred.push({
      CompanyId:this.CompanyId,
      ContactId:this.contactId,
       UserId:this.users[0].id,
       ResponsibleById:this.DispatchById,
       ContactType:this.contacttype,
      CreditType:this.trans.creditTypeStatus,
      StoreId:this.SuppliedById,
      ProviderId:this.SuppliedById,       
      Amount:this.trans.amount,
      Description:this.trans.description,
      TransDate:moment().format('YYYY-MM-DD HH:MM A'),
      CreatedDate:moment().format('YYYY-MM-DD HH:MM A'),
      TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),
      PaymentTypeId:1,
      PaymentStatusId:2,
      TranstypeId:2
    })
    this.Auth.Creditpay(this.paycred).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isTable =  !this.isTable;
      // this.getcreditrepayData();
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
      