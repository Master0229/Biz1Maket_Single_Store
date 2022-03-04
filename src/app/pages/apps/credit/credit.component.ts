import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';
import { NzNotificationService } from 'ng-zorro-antd'
import { merge, Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Location } from '@angular/common';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss']
})
export class CreditComponent implements OnInit {
  isShown = true;
  isTable = false;
  users = [];
  CompanyId = 1;
  stores: any = [];
  paymentType:any =[];
  creditData: any = [];
  billstatus = '';
    billType = 2;
  numRecords = 50;
  ordId = 0;
  Ordprd: any = [];
  OrderedById = 0;
  SuppliedById = 0;
  Accountdata = 0;
  DispatchById = 0;
  contactId = 0;
  orderDate = '';
  paymentmode = 2;
  creditTypeStatus = "";
  contacttype = 2;
  paycred = [];
  amt = 400;
  NewArr: any = [];
  EditCredit: any = [];
  credData: any = [];
  OrdId = 0;
  isRepay = false;
  term: string = '';
  description = '';
  TotalBalance = null;
  supplier="";
  PaymentType = 0;
  paidAmount = 1000;
  items = [];
  bankAccountId = null;
  accTypeId =null;
  isActive = true;
  bankName ="";
accountData:any =[];
label = false;
  // trans =[];
  trans: any = {
    amount: 0, creditTypeStatus: "", PaymentTypeId: 1,
    Description: "", CompanyId: 1, contactId: this.contactId, responsibleById: this.DispatchById,
    storeId: this.SuppliedById, contactType: 0, TotalBalance: null,
    TransDateTime: moment().format('YYYY-MM-DD HH:MM A'), Payment: null,paymentmode:null,
    TransDate: moment().format('YYYY-MM-DD HH:MM\ A'),
    CreatedDate: moment().format('YYYY-MM-DD HH:MM A')
  }
  // contactId:this.contactId,
  // responsibleById:this.DispatchById, contactType:this.contacttype,
  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    public location: Location) {
    this.users = JSON.parse(localStorage.getItem("users"));

  }

  ngOnInit(): void {
    this.getStoreList();
    this.getcreditData("ALL");
    this.getPaymentTypesList();                                                                                                    
this.getBankAccts();
  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores", this.stores)
    })
  }
  getPaymentTypesList() {
    this.Auth.PaymentTypesList(this.CompanyId).subscribe(data => {
      this.paymentType = data;
      console.log("paymentType", this.paymentType)
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
paymttype()
{
if(this.trans.PaymentTypeId == 2)
{
  this.label = true;
}
}

  getcreditData(Billstatus) {
    var x = new Date();
    x.setDate(1);
    x.setMonth(x.getMonth() - 1);
    console.log("fromdate", x)
    // console.log("fromdate",x.setMonth(x.getMonth() - 1))
    this.Ordprd.push({
      companyId: this.CompanyId,
      searchId: this.ordId,
      UserID: this.users[0].id,
      billType: this.billType,
      billstatus: Billstatus,
      numRecords: this.numRecords,
      dateFrom: x
    })
    console.log("billstatus", this.billstatus)
    this.Auth.getCreditdata(this.Ordprd).subscribe(data => {
      this.creditData = data;
      this.filteredvalues = this.creditData;
      console.log("creditData", this.creditData)
    })
  }
  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.creditData.ord.filter(x => x.name1.toLowerCase().includes(this.term.toLowerCase()))
      : this.creditData;
    console.log("filtered values", this.filteredvalues)
  }


  Deletedata(id) {
    this.NewArr.push({
      companyId: this.CompanyId,
      TransactionId: id
    })
    this.Auth.deleteCredit(this.NewArr).subscribe(data => {
      console.log("delete", data)
    })

  }
  getTransList(id) {
    this.isShown = !this.isShown;
    this.isTable = !this.isTable;
    this.credData.push({
      companyId: this.CompanyId,
      id: id
    })
    this.Auth.getTransdata(this.credData).subscribe(data => {
      this.trans = data;
      console.log("EditCredit", this.trans)
    })
  }

  Billstatus(val) {
    console.log("val", val)
    if (val == 1) {
      this.billstatus = "PEN";
    }
    if (val == 2) {
      this.billstatus = "PAID";
    }
    if (val == 3) {
      this.billstatus = "ALL";
    }
          this.getcreditData(this.billstatus);
  }

  locback() {
    this.isShown = !this.isShown;
    this.isTable = !this.isTable;
  }

  onChange(e) {
    console.log("date", e);
    this.orderDate = e;
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
    console.log("item", item);
    this.SuppliedById = item.id;
  }
  searchsupplier = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.storeList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattersupplier = (x: { name: string }) => x.name;
  selectedaccountitem(item) {
    console.log("item", item);
    this.Accountdata = item.id;
  }
  searchBankAccount = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.bankAcct.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatteraccount = (x: { name: string }) => x.name;

  recStatus(Value) {
    console.log("rec", Value)
    this.paymentmode = Value;
  }
  creditStatus(Val) {
    console.log("credit", Val)
    if (Val == 1) {
      this.creditTypeStatus = "SALADV";
    }
    if (Val == 2) {
      this.creditTypeStatus = "PURADV";
    }
    if (Val == 3) {
      this.creditTypeStatus = "MANADV";
    }
    if (Val == 4) {
      this.creditTypeStatus = "OTR";
    }
  }
  getrepayList(Id) {
    this.isTable = this.isTable;
    this.isShown = !this.isShown;
    this.isRepay = !this.isRepay;
    this.Auth.getRecreditData(this.CompanyId, Id).subscribe(data => {
      this.EditCredit = data;
      this.contactId = this.EditCredit.bills[0].contactId;
      // this.trans.paymentTypeId = this.EditCredit.trans[0].paymentType.description
      // this.trans.contacttype = this.EditCredit.trans[0].contactTypeId
      this.SuppliedById = this.EditCredit.bills[0].storeId
      //  this.description = this.EditCredit.bills[0].contact.name;
      this.trans.creditTypeStatus = this.EditCredit.bills[0].creditTypeStr;
      //   this.DispatchById =  this.EditCredit.responsibleById;
      //  this.trans.amount = this.EditCredit.bills[0].billAmount;
      this.trans.contact = this.EditCredit.bills[0].contact.name;
      this.items = this.EditCredit.bills;
      // this.trans.description = this.EditCredit.bills[0].contact.name;
        this.supplier = this.EditCredit.bills[0].store;
      //  this.trans.name = this.EditCredit.trans[0].name;
      //  this.TransactionId = this.EditCredit.trans[0].transactionId;
      console.log("EditCredit", this.EditCredit)
      var totalamount = 20000
      for (let i = 0; i < this.EditCredit.bills.length; i++) {
        this.trans.TotalBalance = this.trans.TotalBalance + this.EditCredit.bills[i].pendAmount;
        console.log(totalamount, this.EditCredit.bills[i].pendAmount)
        if (totalamount > this.EditCredit.bills[i].pendAmount) {
          this.EditCredit.bills[i].pay = this.EditCredit.bills[i].pendAmount;
          totalamount -= this.EditCredit.bills[i].pendAmount
        } else if (totalamount > 0) {
          this.EditCredit.bills[i].pay = totalamount;
          totalamount = 0
        } else
          this.EditCredit.bills[i].pay = 0;
        console.log(this.EditCredit.bills[i].pay)
        //  this.trans.Payment =  this.EditCredit.bills[i].pendAmount - this.trans.amount;
      }
    })
  }
  Submit() {
    this.paycred.push({
      CompanyId: this.CompanyId,
      ContactId: this.contactId,
      UserId: this.users[0].id,
      ResponsibleById: this.DispatchById,
      ContactType: this.trans.contacttype,
      CreditType: this.trans.creditTypeStatus,
      StoreId: this.SuppliedById,
      ProviderId: this.SuppliedById,
      Amount: this.trans.amount,
      Description: this.trans.description,
      TransDate: moment().format('YYYY-MM-DD HH:MM A'),
      CreatedDate: moment().format('YYYY-MM-DD HH:MM A'),
      TransDateTime: moment().format('YYYY-MM-DD HH:MM A'),
      PaymentTypeId: this.trans.paymentmode,
      PaymentStatusId: 2,
      TranstypeId: 8
    })
    this.Auth.Creditpay(this.paycred).subscribe(data => {
      console.log(data)
      this.isShown = !this.isShown;
      this.isTable = !this.isTable;
      this.getcreditData("ALL");
    })
  }
  Repaycredit() {
    this.paycred.push({
      CompanyId: this.CompanyId,
      ContactId: this.contactId,
      UserId: this.users[0].id,
      ResponsibleById: this.DispatchById,
      ContactType: this.contacttype,
      CreditType: this.trans.creditTypeStatus,
      StoreId: this.SuppliedById,
      ProviderId: this.SuppliedById,
      Amount: this.trans.amount,
      Description: this.trans.description,
      TransDate: moment().format('YYYY-MM-DD HH:MM A'),
      CreatedDate: moment().format('YYYY-MM-DD HH:MM A'),
      TransDateTime: moment().format('YYYY-MM-DD HH:MM A'),
      PaymentTypeId: this.trans.paymentmode,
      PaymentStatusId: 2,
      TranstypeId: 8,
      items: this.items
    })
    console.log("update", this.paycred)
    this.Auth.Submitpay(this.paycred).subscribe(data => {
      console.log(data)
      this.isShown = !this.isShown;
      this.isTable = !this.isTable;
      this.getcreditData("ALL");
    })
  }



  contactType(val) {
    this.contacttype = val;
  }
  Delete(Id) {
    this.paycred.push({
      transactionId: Id,
      companyId: this.CompanyId
    })
    this.Auth.DeleteCreditpay(this.paycred).subscribe(data => {
      console.log(data)
    })
  }
}
