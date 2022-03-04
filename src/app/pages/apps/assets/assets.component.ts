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
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  isShown = true;
  isTable = false;
  isEditTable = false;
  users = [];
  CompanyId = 1;
  stores: any = [];
  billData: any = [];
  billstatus = '';
  searchContactId = null;
  numRecords = 50;
  ordId = null;
  Ordprd: any = [];
  OrderedById = 0;
  SuppliedById = 0;
  VendorId = 0;
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
  page = 2;
  assettypes: any = [];
  assetarr = [];
  Editasset: any = [];
  Id = null;
  term: string = '';
  isDetailTable = false;
  // trans =[];
  asset: any = {
    Description: "", CompanyId: 1,
    IsOnlinePayment: false, Count: null, LiabilityType: "",
    Contact: '', Store: "", Vendor: ""
  }
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
    this.getassetdata();
    this.getassettypedata();

  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores", this.stores)
    })
  }
  getassettypedata() {
    this.Auth.getassettype(this.CompanyId).subscribe(data => {
      this.assettypes = data;
      console.log("assettypes", this.assettypes)
    })
  }



  getassetdata() {
    this.Auth.getasset(this.CompanyId).subscribe(data => {
      this.billData = data;
      this.filteredvalues = this.billData.liability;
      console.log("billData", this.billData)
    })
  }

  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.billData.liability.filter(x => x.description.toLowerCase().includes(this.term.toLowerCase()))
      : this.billData;
    console.log("filtered values", this.filteredvalues)
  }

  DeActivate(Id) {
    this.Auth.DeActivateasset(Id).subscribe(data => {
      console.log(data)
      this.getassetdata();
    })
    this.getassetdata();
    this.notification.success("Status Updated Successfully", `Updated successfully.`)
  }
  assettype: any
  model: any = "Rooms"
  Store: any = " ";
  Vendor : any =" ";
  Contact : any =" ";
  upddata(id) {
    this.isShown = !this.isShown;
    this.isEditTable = !this.isEditTable;
    this.isTable = this.isTable;
    this.Auth.editasset(id).subscribe(data => {
      this.Editasset = data;
      console.log("Editasset", this.Editasset)
      this.asset.Description = this.Editasset[0].description;
      this.Id = this.Editasset[0].id;
      this.asset.IsActive = this.Editasset[0].isActive;
      this.asset.IsOnlinePayment = this.Editasset[0].isOnlinePayment;
      this.asset.LiabilityTypeId = this.Editasset[0].liabilityTypeId;
      this.asset.CompanyId = this.Editasset[0].companyId;
      this.asset.StoreId = this.Editasset[0].storeId;
      this.asset.VendorId = this.Editasset[0].vendorId;
      this.asset.ContactId = this.Editasset[0].contactId;
      this.asset.Count = this.Editasset[0].count;
      this.asset.Store = this.Editasset[0].store.name;
      this.asset.Vendor = this.Editasset[0].vendor.name;
      this.asset.Contact = this.Editasset[0].contact.name;
      this.asset.LiabilityType = this.Editasset[0].liabilityType.description;
      this.model = this.Editasset[0].liabilityType
      this.Store = this.Editasset[0].store;
      this.Vendor = this.Editasset[0].vendor;
      this.Contact = this.Editasset[0].contact;
      console.log("Editassetype", this.Editasset)
    })
  }
  Update() {
    console.log("maintBillType", this.assetarr)
    this.assetarr.push({
      LiabilityTypeId: this.DispatchById,
      VendorId: this.VendorId,
      StoreId: this.SuppliedById,
      ContactId: this.contactId,
      Description: this.asset.Description,
      CompanyId: this.asset.CompanyId,
      IsOnlinePayment: this.asset.IsOnlinePayment,
      Count: this.asset.Count,
      id: this.Id
    })
    this.Auth.updasset(this.assetarr).subscribe(data => {
      console.log(data)
      this.isShown = !this.isShown;
      this.isEditTable = !this.isEditTable;
      this.isTable = this.isTable;
      this.getassetdata();
      this.notification.success("Data Updated Successfully", `Updated successfully.`)
    })
  }

  validation() {
    var isvalid = true;
    // if (this.asset.categoryId == 0) isvalid = false;
    // if (this.product.productTypeId == 0) isvalid = false;
    // if (this.product.taxGroupId == 0) isvalid = false;
    // if (this.product.unitId == 0) isvalid = false;
    if (this.asset.Description == '') isvalid = false;
    // if (this.product.description == '') isvalid = false;
    // if (this.product.brand == '') isvalid = false;
    // if (this.product.price == null) isvalid = false;
    // if (this.product.productCode == null) isvalid = false;

    return isvalid;
  }
  submitted: boolean = false;
  DetailAsset(id) {
    this.isShown = !this.isShown;
    this.isTable = this.isTable;
    this.isEditTable = this.isEditTable;
    this.isDetailTable = !this.isDetailTable;
    this.Auth.editasset(id).subscribe(data => {
      this.Editasset = data;
      console.log("Editasset", this.Editasset)
      this.asset.Description = this.Editasset[0].description;
      this.Id = this.Editasset[0].id;
      this.asset.IsActive = this.Editasset[0].isActive;
      this.asset.IsOnlinePayment = this.Editasset[0].isOnlinePayment;
      this.asset.LiabilityTypeId = this.Editasset[0].liabilityTypeId;
      this.asset.CompanyId = this.Editasset[0].companyId;
      this.asset.StoreId = this.Editasset[0].storeId;
      this.asset.VendorId = this.Editasset[0].vendorId;
      this.asset.ContactId = this.Editasset[0].contactId;
      this.asset.Count = this.Editasset[0].count;
      this.asset.Store = this.Editasset[0].store.name;
      this.asset.Vendor = this.Editasset[0].vendor.name;
      this.asset.Contact = this.Editasset[0].contact.name;
      this.asset.LiabilityType = this.Editasset[0].liabilityType.description;
      console.log("Editassetype", this.Editasset)
    })
  }
  goback3() {
    this.isShown = !this.isShown;
    this.isTable = this.isTable;
    this.isEditTable = this.isEditTable;
    this.isDetailTable = !this.isDetailTable;
  }
  locback() {
    this.isShown = !this.isShown;
    this.isTable = !this.isTable;
    this.isEditTable = this.isEditTable;
  }
  goback() {
    this.isShown = !this.isShown;
    this.isEditTable = this.isEditTable;
    this.isTable = !this.isTable;
  }


  selecteddispatchitem(item) {
    console.log("item", item, this.model);
    this.DispatchById = item.id;
  }
  searchdispatch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.assettypes.filter(v => v.description.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatterdispatch = (x: { description: string }) => x.description;

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

  selectedvendoritem(item) {
    console.log("item", item);
    this.VendorId = item.id;
  }
  searchvendor = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.billData.vendor.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattervendor = (x: { name: string }) => x.name;

  Create() {
    this.submitted = true;
    if (this.validation()) {
      console.log("asset", this.asset)
      this.assetarr.push({
        LiabilityTypeId: this.DispatchById,
        VendorId: this.VendorId,
        StoreId: this.SuppliedById,
        ContactId: this.contactId,
        Description: this.asset.Description,
        CompanyId: this.asset.CompanyId,
        IsOnlinePayment: this.asset.IsOnlinePayment,
        Count: this.asset.Count
      })
      console.log("asset", this.assetarr)
      this.Auth.saveasset(this.assetarr).subscribe(data => {
        console.log(data)
        this.isShown = !this.isShown;
        this.isEditTable = this.isEditTable;
        this.isTable = !this.isTable;
        this.getassetdata();
        this.notification.success("Data Saved Successfully", `Saved successfully.`)
      })
    }

  }
  contactType(val) {
    this.contacttype = val;
  }

}
