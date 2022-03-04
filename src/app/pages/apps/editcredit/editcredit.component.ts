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
  selector: 'app-editcredit',
  templateUrl: './editcredit.component.html',
  styleUrls: ['./editcredit.component.scss']
})
export class EditcreditComponent implements OnInit {
  paymentmode =0;
  OrderedById = 0;
  SuppliedById = 0;
  DispatchById = 0;
  orderDate ='';
  EditCredit:any =[];
  paymentType:any =[];
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
  contact:any =" ";
  supplier:any ="";
  isShown =false; 
  trans: any = {   amount: 0, creditTypeStatus:"", PaymentTypeId:1, supplier:'',
  Description: "", CompanyId: 1,contactId:this.contactId,responsibleById:this.DispatchById,
  storeId:this.SuppliedById, contactType:0,name:'',responsibleBy:'',
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
      // this.AddForm = this._fb.group({
      //   Id:[0],
      //   Description: ['', [Validators.required]],
      //   ChargeType: ['', [Validators.required]],
      //   ChargeValue: ['', [Validators.required]],
      //   TaxGroupId: ['', [Validators.required]],
      //   CompanyId: [0, [Validators.required]],
      // })
  
     }

  ngOnInit(): void {
    this.getStoreList();
    this.getTransList();
    this.getPaymentTypesList();
  }

  getPaymentTypesList() {
    this.Auth.PaymentTypesList(this.CompanyId).subscribe(data => {
      this.paymentType = data;
      console.log("paymentType", this.paymentType)
    })
  }

  getTransList()
  {
    this.credData.push({
      companyId:this.CompanyId,
      id:this.OrdId
    })
    this.Auth.getTransdata(this.credData).subscribe(data => {
      this.EditCredit = data;
       console.log("EditCredit",this.EditCredit)
     this.contactId = this.EditCredit.trans[0].contact.id
       this.trans.paymentTypeId = this.EditCredit.trans[0].paymentType.description
      this.trans.contacttype = this.EditCredit.trans[0].contactTypeId
      this.SuppliedById = this.EditCredit.trans[0].storeId
      this.description = this.EditCredit.trans[0].description;
      this.trans.creditTypeStatus = this.EditCredit.creditTypeStr;
      this.DispatchById =  this.EditCredit.responsibleById;
      this.trans.amount = this.EditCredit.trans[0].amount;
     this.trans.description = this.EditCredit.trans[0].description;
     this.trans.supplier = this.EditCredit.trans[0].store.name;
      this.trans.name = this.EditCredit.trans[0].name;
     this.TransactionId = this.EditCredit.trans[0].transactionId;
     this.contact = this.EditCredit.trans[0].contact;
     this.supplier = this.EditCredit.trans[0].store;
      console.log("EditCredit",this.EditCredit)
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
    CreditType:this.trans.creditTypeStatus,
    StoreId:this.SuppliedById,    
    ProviderId:this.SuppliedById,       
    Amount:this.trans.amount,
    Description:this.trans.description,
    TransDate:moment().format('YYYY-MM-DD HH:MM A'),
    CreatedDate:moment().format('YYYY-MM-DD HH:MM A'),
    TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),
    PaymentTypeId:this.trans.PaymentTypeId,
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
locback()
{
  this.router.navigate(['/apps/credit']);
}
}
