import { Component, OnInit, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import * as moment from 'moment'
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzNotificationService } from 'ng-zorro-antd'

@Component({
  selector: 'app-batch-entry',
  templateUrl: './batch-entry.component.html',
  styleUrls: ['./batch-entry.component.scss']
})
export class BatchEntryComponent implements OnInit {
  // groups:any = [];
  @ViewChild('barcodeel', { static: false }) public barcodeel: TemplateRef<any>;//productinput
  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any>;//productinput
  @ViewChild('priceel', { static: false }) public priceel: TemplateRef<any>;//productinput
  // @ViewChild('expdateel', { static: false }) public expdateel: NzDatePickerComponent;//productinput


  dynamicRows: any = [];
  CompanyId: any;
  StoreId: any;
  products: any = [];
  product: any;
  filterproduct = [];
  inputValue: string = '';
  batchentry = {barCode:null, code: '', barcodeId: null, quantity: null, price: null, expiarydate: "", companyid: 0, storeid: 0, productId: 0, product: null, batchno: 0, entrydatetime: "" }
  batchno = 0;
  batchdate = new Date();
  batches:any = [];
  date = new Date();
  time = new Date();
  loginfo = null
  // buffer:'';
  // isuppercase
  constructor(private Auth: AuthService, private notification: NzNotificationService) { }

  ngOnInit(): void {
    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.getBatchProduct();
      this.batchentry = {barCode:null, code: '', barcodeId: null, quantity: null, price: null, expiarydate: "", companyid: this.loginfo.companyId, storeid: this.loginfo.storeId, productId: 0, product: null, batchno: 0, entrydatetime: "" }
    })
    // setInterval(() => {
    //   this.batchdate = new Date();
    // }, 15000);
  }
  getBatchProduct() {
    this.Auth.getBarcodeProduct(this.loginfo.companyId, this.loginfo.storeId).subscribe(data => {
      this.products = data["products"];
      console.log(this.products);
      this.batchno = data["lastbatchno"] + 1;
    })
  }
  now(){
      this.batchdate = new Date();
  }
  onInputAutocomplete() {
    console.log(this.products);
    
    this.filterproduct = this.products.filter(x => x.product.toLowerCase().includes(this.inputValue));
  }

  onChange(e) {
    console.log(e, moment(e), this.date)
  }

  // addNew() {
  //   var obj = { name: "qweqweewe" }
  //   this.dynamicRows.push(obj);
  // }
  searchbybarcode() {
    var product = this.products.filter(x => x.barCode == this.batchentry.barCode)[0];
    console.log(this.batchentry.barCode, this.products, product)
    this.batchentry.product = product;
    this.batchentry.productId = product.productId;
    this.batchentry.barcodeId = product.barcodeId
    this.inputValue = product.product
    this.quantityel['nativeElement'].focus()
  }
  submitted: boolean = false;
  pushintobatch() {
    this.submitted = true;
    if (this.validation()) {
      this.batchentry.batchno = this.batchno;
      this.batchentry.code = this.batchentry.barCode
      this.batchentry.barCode = null
      this.batchentry.entrydatetime = moment(this.batchdate).format('YYYY-MM-DD HH:MM A');
      this.batches.push(this.batchentry);
      this.batchentry = { barCode:null, code: '',barcodeId: null, quantity: null, price: null, expiarydate: "", companyid: this.loginfo.companyId, storeid: this.loginfo.storeId, productId: 0, product: null, batchno: 0, entrydatetime: "" }
      this.inputValue = '';
      this.submitted = false;
      console.log(this.barcodeel);
      
      this.barcodeel['nativeElement'].focus()
      console.log(this.batches)
    }
  }

  delete(index) {
    this.batches.splice(index, 1);
  }

  searchbyproduct(event) {
    // console.log(event)
    console.log(event.element.nativeElement.id)
    var product = this.products.filter(x => x.barcodeId == +event.element.nativeElement.id)[0]
    this.inputValue = product.product;
    // document.getElementById("productautocomplete").nodeValue = product.Product;
    this.batchentry.product = product;
    this.batchentry.productId = product.productId;
    this.batchentry.barcodeId = product.barcodeId;
    this.batchentry.barCode = product.barCode;
    // this.batchentry.code = this.batchentry.barCode
    this.quantityel['nativeElement'].focus()
  }

  validation() {
    var isvalid = true;
    if (this.batchentry.barCode <= 0) isvalid = false;
    if (this.batchentry.quantity <= 0) isvalid = false;
    if (this.batchentry.price <= 0) isvalid = false;
    if (this.batchno == 0) isvalid = false;
    if (this.batchdate == null) isvalid = false;



    // if (this.product.name == '') isvalid = false;
    // console.log(isvalid)
    return isvalid;
  }
  saveBatch() {
    // console.log(this.batches)
    // this.submitted = true;
    // if(this.validation()) {
    this.Auth.getbatchEntry(this.batches,20).subscribe(data => {
      // console.log(data)
      this.Auth.batchproductdb(data["products"]).subscribe(data1 => {
        console.log(data1)
        this.batches = [];
        this.notification.success("Batch Added", "Batch Added Successfully")
        this.batchno = data["lastbatchno"] + 1;
      })
    })
    // }else {
    //   this.notification.error("Error", "Product Added UnSuccessfully")
    // }

  }
}
