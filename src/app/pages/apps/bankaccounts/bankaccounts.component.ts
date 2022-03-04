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
  selector: 'app-bankaccounts',
  templateUrl: './bankaccounts.component.html',
  styleUrls: ['./bankaccounts.component.scss']
})
export class BankaccountsComponent implements OnInit {
  isShown = true;
  isTable =false;
  isEditTable =false;
  users = [];
  CompanyId =1;
  stores :any= [];
  accountData: any =[];
  accountType:any =[];
  accontType:any =" ";
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
  IsVehicle= false;
  IsOnlinePayment = false;
  Editaccount:any =[];
  bankAccountId =null;
  accTypeId = null;
  isActive ='ACT';
  bankName ='';
  term: string = '';
  accountTypeCd ="";
  // trans =[];
  account: any = { AccountNo: null, AccountTypeCd : this.accountTypeCd,BankName:"",CreditLimit:null,
  CardNumber:null,Balance:null,AllowNegative:true,
  City:"",AccountHolder:"",Country:"",ContactNo:"",Email:"",BranchCode:"",OpeningTime:"",
  Address: "", CompanyId: 1,IsSpecial:true,IsActive:true,Id:this.contactId,
  CreatedDate:moment().format('YYYY-MM-DD HH:MM A'),Zip:null,
  ExpiryDate:moment().format('YYYY-MM-DD HH:MM A'),PhoneNo:null,Name:"",
  AlternatePhoneNo:null, Notes:"", ClosingTime:""}
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
    this.getBankAccts();
    this.getacctType();
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
      this.filteredvalues = this.accountData.ord;
      console.log("accountData",this.accountData)
    })
  }
  getacctType()
  {
    this.Auth.getaccountType(this.CompanyId).subscribe(data => {
      this.accountType = data;
      console.log("accountType",this.accountType)
    })

  }

  goback()
  {
    this.isShown =  !this.isShown;
    this.isEditTable = this.isEditTable;
    this.isTable = !this.isTable;
  }

  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.accountData.ord.filter(x => x.accountHolder.toLowerCase().includes(this.term.toLowerCase()))
      : this.accountData;
    console.log("filtered values",this.filteredvalues)
  }

  upddata(id)
  {
        this.isShown =  !this.isShown;
    this.isEditTable = !this.isEditTable;
    this.isTable = this.isTable;
    this.Auth.editaccount(id).subscribe(data => {
      this.EditCredit = data;
      console.log("EditCredit",this.EditCredit) ;
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
     this.accountTypeCd = this.EditCredit.acctList[0].accountType.accountTypeCd;
     this.accontType =  this.EditCredit.acctList[0].accountType
      console.log("EditCredit",this.EditCredit) ;
      })
  }
  Update()
  {
    this.account.AccountTypeCd  = this.accountTypeCd;
    this.account.Name = this.account.AccountHolder; 
    this.account.Id = this.account.BankAccountId; 
         console.log("maintBillType",this.account)
    this.Auth.updaccount(this.account).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isEditTable = !this.isEditTable;
      this.isTable = this.isTable;
    this.getBankAccts();
 this.notification.success("Data Updated Successfully", `Updated successfully.`)
    })
  }
  DeActivate(Id)
  {
    this.Auth.DeActivateaccount(Id).subscribe(data => {
      console.log(data)
      this.getBankAccts();
      this.notification.success("Status Updated Successfully", `Updated successfully.`)
    }) 
    this.getBankAccts();
  }
  goback2()
  {
    this.isShown =  !this.isShown;
    this.isEditTable = !this.isEditTable;
    this.isTable = this.isTable;
  }
    locback()
  {
    this.isShown =  !this.isShown;
    this.isTable =  !this.isTable;
    this.isEditTable = this.isEditTable;
  }
  
  onChange(e) {
    console.log("date",e);
    this.orderDate =e;
  }

  selectedAccountTypeitem(item) {
    console.log("item", item);
    this.accountTypeCd = item.accountTypeCd;
  }
  searchAccountType = (text$: Observable<string>) =>
    text$.pipe(
       debounceTime(200),
      map(term => term === '' ? []
        : this.accountType.filter(v => v.description.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatterAccountType = (x: { description: string }) => x.description;

  validation() {
    var isvalid = true;
   if (this.account.AccountNo == '') isvalid = false;
   if (this.account.Balance == '') isvalid = false;
     if (this.account.BankName == '') isvalid = false;
     if (this.account.CreditLimit == '' ) isvalid = false;
   if (this.account.CardNumber == '') isvalid = false;
     if (this.account.BranchCode == '') isvalid = false;
     if (this.account.AccountHolder == '') isvalid = false;
     if (this.account.StartDate == '') isvalid = false;
    //  if (this.account.productCode == null) isvalid = false;

    return isvalid;
  }
  submitted: boolean = false;

  Create()
  {
    this.submitted = true;
    if (this.validation()) {
    this.account.AccountTypeCd  = this.accountTypeCd;
    this.account.Name = this.account.AccountHolder;
    console.log("account",this.account);
    this.Auth.saveaccount(this.account).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isEditTable = this.isEditTable;
      this.isTable = !this.isTable;
          this.getBankAccts();
          this.notification.success("Data Saved Successfully", `Saved successfully.`)
    })
  }
}
}
      