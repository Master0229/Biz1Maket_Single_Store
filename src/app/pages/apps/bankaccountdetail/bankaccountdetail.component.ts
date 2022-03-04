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
  selector: 'app-bankaccountdetail',
  templateUrl: './bankaccountdetail.component.html',
  styleUrls: ['./bankaccountdetail.component.scss']
})
export class BankaccountdetailComponent implements OnInit {
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
  accountactionId =0;
  isShown =false; 
  account: any = {   amount: 0, creditTypeStatus:"", PaymentTypeId:1, supplier:'',
  description: "", CompanyId: 1,contactId:this.contactId,responsibleById:this.DispatchById,
  storeId:this.SuppliedById, contactType:0,Cname:'',responsibleBy:'',CardNumber:null,
   accountDateTime:moment().format('YYYY-MM-DD HH:MM A'),accountactionId:0,
   accountDate:moment().format('YYYY-MM-DD HH:MM A'),
  CreatedDate:moment().format('YYYY-MM-DD HH:MM A')}


  constructor(
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
    this.getaccountList();
  }
  getaccountList()
  {
    this.Auth.editaccount(this.OrdId).subscribe(data => {
      this.EditCredit = data;
      this.account.AccountTypeCd = this.EditCredit.acctList[0].accountType.description;
       this.account.BankAccountId = this.EditCredit.acctList[0].id
      this.account.AccountHolder = this.EditCredit.acctList[0].accountHolder;
      this.account.AccountNo = this.EditCredit.acctList[0].accountNo;
      this.account.Balance = this.EditCredit.acctList[0].balance
      this.account.BankName = this.EditCredit.acctList[0].bankName;
     this.account.CardNumber = this.EditCredit.acctList[0].cardNumber;
     this.account.CreditLimit = this.EditCredit.acctList[0].creditLimit;
     this.account.IsActive = this.EditCredit.acctList[0].isActive;
     this.account.PhoneNo = this.EditCredit.acctList[0].phoneNo;
     this.account.State = this.EditCredit.acctList[0].state;
     this.account.Zip = this.EditCredit.acctList[0].zip;
     this.account.Email = this.EditCredit.acctList[0].email;
     this.account.City = this.EditCredit.acctList[0].city;
     this.account.Address = this.EditCredit.acctList[0].address;
     this.account.AlternatePhoneNo = this.EditCredit.acctList[0].alternatePhoneNo;
     this.account.Notes = this.EditCredit.acctList[0].notes;

      console.log("EditCredit",this.EditCredit) ;
      })
  }
  onChange(e) {
    console.log("date",e);
    this.orderDate =e;
  }

}
