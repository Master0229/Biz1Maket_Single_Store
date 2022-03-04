import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as moment from 'moment'
import { FormControl, Validators ,FormBuilder} from '@angular/forms';
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
  selector: 'app-editcreditrepay',
  templateUrl: './editcreditrepay.component.html',
  styleUrls: ['./editcreditrepay.component.scss']
})
export class EditcreditrepayComponent implements OnInit {
  paymentmode =0;
  OrderedById = 0;
  SuppliedById = 0;
  DispatchById = 0;
  orderDate ='';
  EditCredit:any =[];
  stores :any= [];
  credData:any =[];
  CompanyId =1;
  OrdId = 0;
  users = [];
  contactId =0;
  contacttype =0;
  paycred =[];
  credit =[];
  AddForm =[];
  isTable =true;
  PaymentTypeId =0;
  description ='';
  creditTypeStatus ='';
  amount =0;
  TransactionId =0;
  isShown =false; 
  trans: any = {   amount: 0, creditTypeStatus:"", PaymentTypeId:1, supplier:'',
  description: "", CompanyId: 1,contactId:this.contactId,responsibleById:this.DispatchById,
  storeId:this.SuppliedById, contactType:0,Cname:'',responsibleBy:'',
  TotalBalance:null,
   TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),TransactionId:0,
   TransDate:moment().format('YYYY-MM-DD HH:MM A'),
  CreatedDate:moment().format('YYYY-MM-DD HH:MM A')}

  constructor(
    private _fb: FormBuilder ,
    private modalService: NgbModal,
     private Auth: AuthService,
    private notification: NzNotificationService,
    private router: Router ,
    private _avRoute: ActivatedRoute,
    public location: Location )

    {
      this.OrdId = this._avRoute.snapshot.params["id"];
      this.users = JSON.parse(localStorage.getItem("users"));
     }

  ngOnInit(): void {
    this.getStoreList();
    this.getTransList();
  }
  getTransList()
  {
    this.Auth.getrepaydata(this.CompanyId,this.OrdId).subscribe(data => {
      this.EditCredit = data;
      this.contactId = this.EditCredit.bills[0].contactId
      // this.trans.paymentTypeId = this.EditCredit.bills.paymentType.description
      // this.trans.contacttype = this.EditCredit.bills.contactTypeId
      this.SuppliedById = this.EditCredit.bills[0].providerId
      // this.description = this.EditCredit.bills.description;
      // this.creditTypeStatus = this.EditCredit.creditTypeStr;
      this.DispatchById =  this.EditCredit.responsibleById;
      // this.trans.amount = this.EditCredit.bills[0].pendAmount;
    //  this.trans.description = this.EditCredit.bills.description;
    //  this.trans.supplier = this.EditCredit.bills.store.name;
     this.trans.contact = this.EditCredit.bills[0].contact.name;
    //  this.TransactionId = this.EditCredit.bills.transactionId;
          console.log("EditCredit",this.EditCredit)
          for (let i = 0; i < this.EditCredit.bills.length; i++) {
            this.trans.TotalBalance = this.trans.TotalBalance + this.EditCredit.bills[i].pendAmount;
            this.trans.amount = this.trans.amount + this.EditCredit.bills[i].pendAmount;
          }
      })
  }
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


  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
  }

  recStatus(Value)
  {
    console.log("rec",Value)
this.paymentmode =Value;
  }
  creditStatus(Val)
  {
    console.log("credit",Val)
    this.creditStatus = Val;
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

Updatecredit()
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
    PaymentTypeId:1,
    PaymentStatusId:2,
    TranstypeId:8,
    TransModeId:8,
    TransactionId:this.TransactionId,
  })
  this.Auth.UpdCredit(this.paycred).subscribe(data => {
    console.log(data)
  })
  this.router.navigate(['/apps/credit']);
}
goback()
{
  this.router.navigate(['/apps/creditrepay']);
}
}
