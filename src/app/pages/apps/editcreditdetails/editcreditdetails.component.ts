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
  selector: 'app-editcreditdetails',
  templateUrl: './editcreditdetails.component.html',
  styleUrls: ['./editcreditdetails.component.scss']
})
export class EditcreditdetailsComponent implements OnInit {
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
   TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),TransactionId:0,
   TransDate:moment().format('YYYY-MM-DD HH:MM A'),
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
    this.getTransList();``
  }
  getTransList()
  {
    this.credData.push({
      companyId:this.CompanyId,
      id:this.OrdId
    })  
    this.Auth.getTransdata(this.credData).subscribe(data => {
      this.EditCredit = data;
      this.contactId = this.EditCredit.trans[0].contactId
      this.trans.paymentTypeId = this.EditCredit.trans[0].paymentType.description
      this.trans.contacttype = this.EditCredit.trans[0].contactTypeId
      this.SuppliedById = this.EditCredit.trans[0].storeId
      this.description = this.EditCredit.trans[0].description;
      this.creditTypeStatus = this.EditCredit.creditTypeStr;
      this.DispatchById =  this.EditCredit.responsibleById;
      this.trans.amount = this.EditCredit.trans[0].amount;
     this.trans.description = this.EditCredit.trans[0].description;
     this.trans.supplier = this.EditCredit.trans[0].store.name;
     this.trans.name = this.EditCredit.trans[0].name;
     this.TransactionId = this.EditCredit.trans[0].transactionId;
      console.log("EditCredit",this.EditCredit)
      })
  }
  onChange(e) {
    console.log("date",e);
    this.orderDate =e;
  }

}
