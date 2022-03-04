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
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  isShown = true;
  isTable =false;
  isEditTable =false;
  users = [];
  CompanyId =1;
  stores :any= [];
  ContactData:any =[];
  locationData: any =[];
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
  Editlocate:any =[];
  term: string = '';
  isDetailTable = false;
  // trans =[];
  locate: any = { Name: "", Updated : false,IsSalesStore:false,
  City:"",PostalCode:"",Country:"",ContactNo:"",Email:"",GSTno:"",OpeningTime:"",
  Address: "", CompanyId: 1,IsSpecial:true,IsActive:true,
  CreatedDate:moment().format('YYYY-MM-DD HH:MM A'),
  ClosingTime:""}
  constructor(
    private modalService: NgbModal,
     private Auth: AuthService,
    private notification: NzNotificationService,
    private router: Router ,
    private route: ActivatedRoute,
    public location: Location,
     )
     { 
      this.users = JSON.parse(localStorage.getItem("users"));

    }

  ngOnInit(): void {
    this.getContactList();
    this.getlocation();

  }
  getContactList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("getContactList",this.stores)
      })
  }

  getlocation() {
    this.Auth.getlocation(this.CompanyId).subscribe(data => {
      this.locationData = data;
      this.filteredvalues = this.locationData;
      console.log("locationData",this.locationData)
      console.log("gdsg",this.filteredvalues)
    })
  }
  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.locationData.filter(x => x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.locationData;
    console.log("filtered values",this.filteredvalues)
  }


  goback()
  {
    this.isShown =  !this.isShown;
    this.isEditTable = this.isEditTable;
    this.isTable = !this.isTable;
  }
  goback3()
  {
    this.isShown =  !this.isShown;
    this.isEditTable = this.isEditTable;
    this.isTable = this.isTable;
    this.isDetailTable = !this.isDetailTable;
  }
  upddata(id)
  {
        this.isShown =  !this.isShown;
    this.isEditTable = !this.isEditTable;
    this.isTable = this.isTable;
         this.Auth.editlocate(id).subscribe(data => {
       this.Editlocate = data;
             this.locate.Name = this.Editlocate.name;
      this.locate.Id = this.Editlocate.id;
      this.locate.IsActive = this.Editlocate.isactive;
      this.locate.City = this.Editlocate.city;
      this.locate.Country = this.Editlocate.country;
      this.locate.PostalCode = this.Editlocate.postalCode;
      this.locate.OpeningTime = this.Editlocate.openingTime;
      this.locate.Email = this.Editlocate.email;
      this.locate.ContactNo = this.Editlocate.contactNo;
      this.locate.CompanyId = this.Editlocate.companyId;
      this.locate.ClosingTime = this.Editlocate.closingTime;
      this.locate.Updated = this.Editlocate.updated;
      this.locate.GsTno = this.Editlocate.gsTno;
            console.log("Editlocate",this.Editlocate)
         })
  }
  Update()
  {
         console.log("maintBillType",this.locate)
    this.Auth.updlocate(this.locate).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isEditTable = !this.isEditTable;
      this.isTable = this.isTable;
              this.getlocation();
              this.notification.success("Data Updated Successfully", `Updated successfully.`)
    })
  }
  DeActivate(Id)
  {
    this.Auth.DeActivatestore(Id).subscribe(data => {
      console.log(data) 
      this.getlocation();
    }) 
    this.getlocation();
    this.notification.success("Status Updated Successfully", `Updated successfully.`)
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

  selectedcontactitem(item) {
    console.log("item", item);
    this.contactId = item.id;
     this.locate.Id = this.contactId;
  }
  searchcontact = (text$: Observable<string>) =>
    text$.pipe(
       debounceTime(200),
      map(term => term === '' ? []
        : this.stores.cusList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattercontact = (x: { name: string }) => x.name;

  validation() {
    var isvalid = true;
   if (this.locate.Name == '') isvalid = false;
   if (this.locate.ContactNo == '') isvalid = false;
   if (this.locate.GSTno == null) isvalid = false;
   if (this.locate.Email == '') isvalid = false;
   if (this.locate.OpeningTime == '') isvalid = false;
   if (this.locate.Address == '') isvalid = false;
   if (this.locate.ClosingTime == '') isvalid = false;
    return isvalid;
  }
  submitted: boolean = false;
  Detailstore(id)
  {
    this.isShown =  !this.isShown;
    this.isEditTable = this.isEditTable;
    this.isTable = this.isTable;
    this.isDetailTable = !this.isDetailTable;
         this.Auth.editlocate(id).subscribe(data => {
       this.Editlocate = data;
       console.log("Editlocate",this.Editlocate)
             this.locate.Name = this.Editlocate.name;
      this.locate.Id = this.Editlocate.id;
      this.locate.IsActive = this.Editlocate.isactive;
      this.locate.City = this.Editlocate.city;
      this.locate.Country = this.Editlocate.country;
      this.locate.PostalCode = this.Editlocate.postalCode;
      this.locate.OpeningTime = this.Editlocate.openingTime;
      this.locate.Email = this.Editlocate.email;
      this.locate.ContactNo = this.Editlocate.contactNo;
      this.locate.CompanyId = this.Editlocate.companyId;
      this.locate.ClosingTime = this.Editlocate.closingTime;
      this.locate.Updated = this.Editlocate.updated;
      this.locate.GsTno = this.Editlocate.gsTno;
            console.log("Editlocate",this.Editlocate)
         })
  }
  Create()
  {
    this.submitted = true;
    if (this.validation()) {
    console.log("locate",this.locate);
    this.Auth.savelocate(this.locate).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isEditTable = this.isEditTable;
      this.isTable = !this.isTable;
          this.getlocation();
          this.notification.success("Data Saved Successfully", `Saved successfully.`)
    })
  }           
  }
}
      