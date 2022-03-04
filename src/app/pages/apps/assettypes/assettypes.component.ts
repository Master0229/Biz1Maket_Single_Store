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
  selector: 'app-assettypes',
  templateUrl: './assettypes.component.html',
  styleUrls: ['./assettypes.component.scss']
})
export class AssettypesComponent implements OnInit {
  isShown = true;
  isTable =false;
  isEditTable =false;
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
  term: string = '';
  Editassetype:any =[];
  // trans =[];
  asset: any = { IsVehicle: false, IsOnlinePayment : false,
  Description: "", CompanyId: 1,IsSpecial:true,IsActive:true,Id:0,
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
    this.getassettypedata();

  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
  }
  getassettypedata() {
    this.Auth.getassettype(this.CompanyId).subscribe(data => {
      this.billData = data;
      this.filteredvalues = this.billData;
      console.log("billData",this.billData)
    })
  }
  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.billData.filter(x => x.description.toLowerCase().includes(this.term.toLowerCase()))
      : this.billData;
    console.log("filtered values",this.filteredvalues)
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
  goback()
  {
    this.isShown =  !this.isShown;
    this.isEditTable = this.isEditTable;
    this.isTable = !this.isTable;
  }
  
  upddata(id)
  {
        this.isShown =  !this.isShown;
    this.isEditTable = !this.isEditTable;
    this.isTable = this.isTable;
         this.Auth.editassettype(id).subscribe(data => {
       this.Editassetype = data;
             this.asset.Description = this.Editassetype.description;
      this.asset.Id = this.Editassetype.id;
      this.asset.IsActive = this.Editassetype.isActive;
      this.asset.IsOnlinePayment = this.Editassetype.isOnlinePayment;
      this.asset.IsVehicle = this.Editassetype.isVehicle;
      this.asset.CompanyId = this.Editassetype.companyId;
            console.log("Editassetype",this.Editassetype)
         })
  }
  Update()
  {
         console.log("maintBillType",this.asset)
    this.Auth.updassettype(this.asset).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isEditTable = !this.isEditTable;
      this.isTable = this.isTable;
              this.getassettypedata();
              this.notification.success("Data Updated Successfully", `Updated successfully.`)
    })
  }
  DeActivate(Id)
  {
    this.Auth.DeActivateassettype(Id).subscribe(data => {
      console.log(data)
      this.getassettypedata();
      this.notification.success("Status Updated Successfully", `Updated successfully.`)
    }) 
    this.getassettypedata();
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
  validation() {
    var isvalid = true;
   if (this.asset.Description == '') isvalid = false;
    return isvalid;
  }
  submitted: boolean = false;

  Create()
  {
    this.submitted = true;
    if (this.validation()) {
    console.log("asset",this.asset);
    this.Auth.saveassettype(this.asset).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
       this.isEditTable = this.isEditTable;
      this.isTable = !this.isTable;
          this.getassettypedata();
          this.notification.success("Data Saved Successfully", `Saved successfully.`)
    })
  }
  }
}
      