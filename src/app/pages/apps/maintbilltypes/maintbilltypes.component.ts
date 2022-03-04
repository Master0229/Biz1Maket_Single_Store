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
  selector: 'app-maintbilltypes',
  templateUrl: './maintbilltypes.component.html',
  styleUrls: ['./maintbilltypes.component.scss']
})
export class MaintbilltypesComponent implements OnInit {
  isShown = true;
  isTable =false;
  isEditTable = false;
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
  maintBillType =[];
  amt =400;
  NewArr:any =[];
  EditmaintBill:any =[];
  credData:any =[];
  OrdId = 0;
  isRepay = false;
  page = 2;
  assettypes:any =[];
  assettypeId =null;
  IsActive = true;
  IsVerify = true;  
  Editbill:any =[];
  AssetType:any =" ";
  term: string = '';
  id =null;
  isDetailTable = false;
  asset: any = {   amount: 0, creditTypeStatus:"", PaymentTypeId:1, 
  description: "", CompanyId: 1,contactId:this.contactId,responsibleById:this.DispatchById,
  storeId:this.SuppliedById, contactType:0,liabilityType:"",
  IsActive:true,
  IsVerify:true,
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
    this.getStoreList();
    this.getmaintbilldata();
this.getassettypedata();
  }
  getassettypedata() {
    this.Auth.getassettype(this.CompanyId).subscribe(data => {
      this.assettypes = data;
      console.log("billData",this.billData)
    })
  }

  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
  }

  getmaintbilldata() {
    this.Auth.getmaintbill(this.CompanyId).subscribe(data => {
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
    this.Auth.deleteCredit(this.NewArr).subscribe(data => {
      console.log("delete",data)
      })
  }


  locback()
  {
    this.isShown =  !this.isShown;
    this.isTable = !this.isTable;
    this.isEditTable = this.isEditTable;
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
    this.Auth.editmaintbill(id).subscribe(data => {
      this.Editbill = data;
      console.log("asset",this.Editbill)
      this.asset.description = this.Editbill[0].description;
      this.id = this.Editbill[0].id;
      this.asset.IsActive = this.Editbill[0].isActive;
      this.asset.IsVerify = this.Editbill[0].isVerify;
      this.asset.DispatchById = this.Editbill[0].liabilityTypeId;
      this.AssetType = this.Editbill[0].liabilityType;
    })
  }
goback2()
{
  this.isShown =  !this.isShown;
  this.isEditTable = !this.isEditTable;
  this.isTable = this.isTable;
}
DetailbillType(id)
{
  this.isShown =  !this.isShown;
  this.isEditTable = this.isEditTable;
  this.isTable = this.isTable;
  this.isDetailTable = !this.isDetailTable;
  this.Auth.editmaintbill(id).subscribe(data => {
    this.Editbill = data;
    console.log("asset",this.Editbill)
    this.asset.description = this.Editbill[0].description;
    this.id = this.Editbill[0].id;
    this.asset.IsActive = this.Editbill[0].isActive;
    this.asset.IsVerify = this.Editbill[0].isVerify;
    this.asset.DispatchById = this.Editbill[0].liabilityTypeId;
    this.asset.liabilityType = this.Editbill[0].liabilityType.description;
  })
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
        : this.assettypes.filter(v => v.description.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatterdispatch = (x: { description: string }) => x.description;

  validation() {
    var isvalid = true;
   if (this.asset.description == '') isvalid = false;
    return isvalid;
  }
  submitted: boolean = false;

  Create()
  {
    this.submitted = true;
    if (this.validation()) {
    this.maintBillType.push({
      CompanyId:this.CompanyId,
      LiabilityTypeId:this.DispatchById,
      Description:this.asset.description,
      CreatedDate:moment().format('YYYY-MM-DD HH:MM A'),
      IsActive:this.IsActive,
      IsVerify:this.IsVerify
    })
    this.Auth.savemaintbill(this.maintBillType).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isEditTable = this.isEditTable;
      this.isTable = !this.isTable;
          this.getmaintbilldata();
          this.notification.success("Data Saved Successfully", `Saved successfully.`)
    })
  }
  }
  Update()
  {
    this.maintBillType =[];
    this.maintBillType.push({
      id:this.id,
      CompanyId:this.CompanyId,
      LiabilityTypeId:this.DispatchById,
      Description:this.asset.description,
      CreatedDate:moment().format('YYYY-MM-DD HH:MM A'),
      IsActive:this.IsActive,
      IsVerify:this.IsVerify
    })
         console.log("maintBillType",this.maintBillType)
    this.Auth.updmaintbill(this.maintBillType).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isEditTable = !this.isEditTable;
      this.isTable = this.isTable;
              this.getmaintbilldata();
              this.notification.success("Data Updated Successfully", `Updated successfully.`)
    })
  }
  DeActivate(Id)
  {
    this.Auth.DeActivatebill(Id).subscribe(data => {
      console.log(data)
      this.getmaintbilldata();
    }) 
    this.getmaintbilldata();
  }
}
      