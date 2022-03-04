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
  selector: 'app-billbyvendor',
  templateUrl: './billbyvendor.component.html',
  styleUrls: ['./billbyvendor.component.scss']
})
export class BillbyvendorComponent implements OnInit {
  vendors:any =[];
  stores:any =[];
  paymentTypes:any =[];
  users = [];
  isShown = true;
  isTable =false;
  vendorId = null;
  SuppliedById = null;
  CompanyId =1;
  paycred =[];
  numRecords =50;
  type ='';
  items:any =[];
  bankAccountId = null;
  accTypeId =null;
  isActive = true;
  label = false;
  term: string = '';

  Ordprd =[];
  bankName ="";
accountData:any =[];
  vendor: any = {  name:'',amount: null, creditTypeStatus:"", PaymentTypeId:1, accountNo:null,
  Description: "", CompanyId: 1,balance:null,billDate:'',billId:null,pay:null,
  storeId:this.SuppliedById, contactType:0,contactId:null,
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
    this.getvendorList();
    this.getStoreList();
    this.getPaymentTypesList();
    this.getBankAccts();
  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
  }

  getvendorList() {
    this.Auth.getvendors(this.CompanyId).subscribe(data => {
      this.vendors = data;
      this.filteredvalues =this.vendors.value.billList;
      console.log("vendors",this.vendors)
      })
  }
  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.vendors.value.billList.filter(x => x.provider.toLowerCase().includes(this.term.toLowerCase()))
      : this.vendors;
    console.log("filtered values",this.filteredvalues)
  }


  getPaymentTypesList() {
    this.Auth.PaymentTypesList(this.CompanyId).subscribe(data => {
      this.paymentTypes = data;
      console.log("paymentTypes", this.paymentTypes)
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
    this.vendors.value.bills.forEach(element => {
      element["pay"] = this.vendor.amount;                                                                                                                                                     
    }) 
    console.log("paymentTypes", this.items) 
  }
  paymttype()
  {
  if(this.vendor.PaymentTypeId =="2")
  {
    this.label = true;
  }
  }
  
  Submit()
  {
    this.paycred.push({
      companyId:this.CompanyId,
trans:this.vendor,
creditArr:this.items,
type :this.type,
UserId:this.users[0].id
    })
    console.log("data",this.paycred)
    this.Auth.billpay(this.paycred).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isTable =  !this.isTable;
    })
  }
  selectedvendoritem(item) {
    console.log("item", item);
    this.vendorId = item.id;
  }
  searchvendor = (text$: Observable<string>) =>
    text$.pipe(
       debounceTime(200),
      map(term => term === '' ? []
        : this.vendors.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattervendor = (x: { name: string }) => x.name;

  selectedsupplieritem(item) {
    console.log("item",item);
    this.SuppliedById =item.id;
    this.getbilldetails(item.id,this.vendorId)
  }
  getbilldetails(Id,vendorId)
  {
    this.isTable = !this.isTable;
    this.isShown = !this.isShown;
    console.log("item",Id,vendorId);
    this.Auth.getbillnpays(Id,vendorId).subscribe(data => {
      this.vendors = data;
      console.log("vendors",this.vendors)
      this.vendor.Description = this.vendors.value.billList[0].contact.name;
      // this.vendor.amount = this.vendors.value.billList[0].amount;
      this.vendor.balance = this.vendors.value.balance;
      this.vendor.billDate = this.vendors.value.billList[0].billDate;
       this.vendor.name = this.vendors.value.paymentStore;
       this.vendor.storeId = this.vendors.value.bills[0].storeId
       this.items = this.vendors.value.bills;
       this.vendor.contactId = this.vendors.value.contactId;
       this.vendor.billId = this.vendors.value.bills[0].billId;
       this.vendors.value.bills.forEach(element => {
         element["pay"] = this.vendor.amount; 
         element["BillId"] = this.vendor.billId;                                                                                                                                                          
       })  
      console.log("vendors",this.vendors)
      })
  }
  searchsupplier = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.storeList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattersupplier = (x: { name: string }) => x.name;

}
