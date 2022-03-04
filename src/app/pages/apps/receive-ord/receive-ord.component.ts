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
import { OrderItemModule, OrderModule, ReceiveModule } from './receive-ord.module';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Location } from '@angular/common';

@Component({
  selector: 'app-receive-ord',
  templateUrl: './receive-ord.component.html',
  styles: [
    `
      button {
        margin-bottom: 16px;
      }

      .editable-cell {
        position: relative;
      }

      .editable-cell-value-wrap {
        padding: 5px 12px;
        cursor: pointer;
      }

      .editable-row:hover .editable-cell-value-wrap {
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 4px 11px;
      }
    `,
  ],
})
export class ReceiveOrdComponent implements OnInit {
  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any>;//productinput
  @ViewChild('discper', { static: false }) public discperel: TemplateRef<any>;
  @ViewChild('disc', { static: false }) public discel: TemplateRef<any>;
  // @ViewChild('instance2', { static: true }) instance2: NgbTypeahead
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>;
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;

  model: any = 'QWERTY'
  order: OrderModule
  RecData: ReceiveModule
  inputValue: string = '';
  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.products.filter(v => v.product.toLowerCase().indexOf(term.toLowerCase()) > -1 || v.barCode?.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatter = (x: { product: string }) => x.product;

  searchdispatch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.cusList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatterdispatch = (x: { name: string }) => x.name;

  searchStock = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.Stocks.filter(v => v.stockContainerName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatterStock = (x: { stockContainerName: string }) => x.stockContainerName;

  // @ViewChild('cardnumber', { static: false }) cardnumber: ElementRef;
  buffer = '';
  paymenttypeid = 1;
  isuppercase: boolean = false;
  WaiterId = null;
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let data = this.buffer || '';
    if (event.key !== 'Enter' && event.key !== 'Shift') { // barcode ends with enter -key
      if (this.isuppercase) {
        data += event.key.toUpperCase();
        this.isuppercase = false;
      } else {
        data += event.key;
      }
      this.buffer = data;
    } else if (event.key === 'Shift') {
      this.isuppercase = true;
    } else {
      this.buffer = '';
      this.setproductbybarcode(data);
    }
    // console.log(event)
  }
  Idorder =0;
  radioValue = 'A'
  recUpdId ='';
  billAmountNoTax =null;
  bill =0;
  OrdDispData:any =[];
  scrollContainer: any;
  dispList:any =[];
  finalarray: any = [];
  products: any = [];
  Stocks: any = [];
  OrdData: any = [];
  popupData: any = [];
  stores: any = [];
  filteredvalues = [];
  barcValue: string = '';
  cartitems: any = [];
  ordDetails: any = [];
  ordPrdDetails: any = [];
  subtotal = 0;
  searchTerm = '';
  tax = 0;
  receiveById = null;
  discount = 0;
  isVisible = false;
  batchno = 5;
  isDisp = false;
  isShown = true;
  ordNo = 0;
  storeId = 0;
  orderDate = '';
  CustomerAddressId = null;
  CompanyId = 1;
  CustomerId = null;
  InvoiceNo = 0;
  sourceId = 0;
  DiningTableId = null;
  Price = 0;
  refamt = 0;
  Tax1 = 0;
  Tax2 = 0;
  Tax3 = 0;
  CancelStatus = 0;
  ProdStatus = '';
  DispatchStatus = 0;
  ReceiveStatus = 0;
  OrderStatusId = 0;
  OrderedById = 0;
  SuppliedById = 0;
  FoodReady = true;
  OrderType = 1;
  UserId = null;
  SpecialOrder = false;
  Charges;
  OrderDiscount = 0;
  OrderTaxDisc = 0;
  OrderTotDisc = 0;
  AllItemDisc = 0;
  AllItemTaxDisc = 0;
  AllItemTotalDisc = 0;
  DiscAmount = 0;
  DiscPercent = 0;
  SplitTableId = 0;
  PreviousStatusId = 0;
  AutoOrderId = 0;
  isRxve = true;
  isNRxve = false;
  closeResult = '';
  ordId = null;
  TotalProductSale = 0;
  TotalPrdQty = 0;
  streId = 0;
  OrdId = 0;
  dispatchTypeId = 1;
  StkContainerName = '';
  StoreId = null;
  // ContainerName ='';
  act = 'Chk'
  users = [];
  displayprd :any = [];
  Ordprd:any =[];
  dispatchType ='';
  orderType ='Receiver';
  orderStatus =null;
  numRecordsStr =50;
  dispatchStatus = 1;

  tableData = [
    {
      "key": "1",
      "actionName": "New Users",
      "progress": { "value": 60, "color": "bg-success" },
      "value": "+3,125"
    },
    {
      "key": "2",
      "actionName": "New Reports",
      "progress": { "value": 15, "color": "bg-orange" },
      "value": "+643"
    },
    {
      "key": "3",
      "actionName": "Quote Submits",
      "progress": { "value": 25, "color": "bg-primary" },
      "value": "+982"
    }
  ]
  submitted: boolean = false;
  temporaryItem: any = { DiscAmount: 0, DispatchQty: null, StorageStoreId: null, StorageStoreName: '', BatchNum: null, ContainerCount: null, ContainerId: null, ContainerName: '' };
  barcodeItem = { quantity: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0, StorageStoreId: null, StorageStoreName: '', BatchNum: null, ContainerCount: null, ContainerId: null, ContainerName: '' };
  barcodemode: boolean = false;
  customerdetails = { data_state: '', name: '', PhoneNo: '', email: '', address: '', companyId: 1 }
  customers: any = [];
  ContainWgt: null;
  StockContainerId: null;
  createby: '';
  ResponsibleBy:null;
  array: any = [];
  billId =0;
  dispDetails:any =[];
  billAmount =0;
  taxAmount =0;
  orderId = 0;
  billStatus =3;
  // quantityfc = new FormControl('', [Validators.required, Validators.min(1)]);


  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
     private router: Router ,
    private _avRoute: ActivatedRoute,
    public location: Location) {

    // this.OrdId = this._avRoute.snapshot.params["id"];
    this.users = JSON.parse(localStorage.getItem("users"));

  }

  selectedsupplieritem(item) {
    console.log("item",item);
    this.SuppliedById =item.id;
  }
  searchsupplier = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.cusList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattersupplier = (x: { name: string }) => x.name;

  selectedreceiveritem(item) {
    console.log("item",item);
    this.OrderedById =item.id;
  }
  searchreceiver = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.cusList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatterreceiver = (x: { name: string }) => x.name;

  dropdownnew(Value) {
    console.log("Value",Value)
    this.ResponsibleBy = Value;
  }

  getord() {
    this.Ordprd.push({
      companyId:this.CompanyId,
      searchId:this.ordId,
      UserID:this.users[0].id,
      orderType:this.orderType,
      orderStatus:this.orderStatus,
      NumRecords:this.numRecordsStr,
      dispatchStatus:this.dispatchStatus
    })
    this.Auth.getorder(this.Ordprd).subscribe(data => {
        this.ordDetails = data;
        if(this.billStatus == 3)
        {

        }
      })
    }
  recStatus(Value)
  {
    console.log("recStatus",Value)
    this.billStatus = Value;
    this.getOrderList();
  }
  rec(id)
  {
    this.isShown = !this.isShown;
    this.isDisp = !this.isDisp;
    this.getDispatchList(id);
  }
  getBarcodeProduct() {
    this.Auth.getBarcodeProduct(this.CompanyId, 0).subscribe(data => {
      console.log(data)
      this.products = data["products"];
      this.batchno = data["lastbatchno"] + 1;

    })
  }
  getStockContainer() {
    this.Auth.getStockContainer(this.CompanyId, 8).subscribe(data => {
      console.log("Stocks", data)
      this.Stocks = data;

    })
  }

recUpd(Id)
{
  this.recUpdId =Id;
  this.router.navigate(['/apps/editreceive',Id]);

}
  radio(value1)
  {
    console.log("value",value1)
   this.dispatchType =value1; 
   this.getOrderList();
  }
  getOrderList()
  {
    console.log("dispatchType", this.dispatchType)
    console.log("dispatchType", this.billStatus)
    this.Ordprd.push({
      companyId:this.CompanyId,
      orderId:this.ordId,
      UserId:this.users[0].id,
      dispatchType:this.dispatchType,
      billStatus:this.billStatus,
      NumRecords:this.numRecordsStr,
    })
    this.Auth.getOrdDisp(this.Ordprd).subscribe(data => {
      console.log("ffffffffffffffffff", data)
      this.OrdDispData = data;
    }) 
  }
  getDispatchList(bill) {
this.bill = bill;
    this.displayprd.push({
      companyId:this.CompanyId,
      billId:this.bill
    })
    // console.log("data",this.displayprd)
    this.Auth.getDispatchList( this.displayprd).subscribe(data => {
      console.log("dispLiffffffdddst", data)
      this.dispList = data;
      this.dispList.orderProductDetList.forEach(element => {
        element.receiveProduct = this.dispList.receiveProductList.filter(x => x.receiveProductId == element.actualProdId)[0].receiveProduct 
          element.receiveStorageId = this.dispList.storageStrList.filter(x => x.orderProductId == element.orderItemId)[0].storeId 
          // element.OrderId = this.dispList.bill.filter(x => x.billId == element.billId)[0].billId 
      element.OrdId = this.dispList.bill.orderId;
        });
      
              this.dispList.ordItem.forEach(element => {
          element.Action = "Chk";
          element.updated = false;
          element["Action"] = 'Chk'
          element["updated"] = false;
          element["ordItemType"] = 3
          this.array.push({
            CompanyId: element["companyId"],
            OrderItemType: element["ordItemType"],
            ContainerId: element["containerId"],
            ContainerWeight: element["containerWeight"],
            OpenQty: element["quantity"],
            GrossQty: element["quantity"],
            DispatchQty: element["quantity"],
            OrderQuantity: element["quantity"],
            Quantity: element["quantity"],
             DispatchProductId: element["productId"],
             ProductId: element["productId"],
             Dispatchprd: element["receiveProduct"],
             ProductName: element["receiveProduct"],
            Price: element["unitPrice"],
            Tax1: element["tax1"],
            Tax2: element["tax2"],
            Tax3: element["tax2"],
            Amount: element["amount"],
            Action: element["Action"],
            OrderItemId: element["orderItemId"],
            OrderItemDetailId: element["id"],
            // StorageStoreId: element["receiveStorageId"],
            Updated: element["updated"],
            OrderItemRefId: element["orderItemRefId"],
            RefId: element["refId"],
            OrdItemDetailId: element["orderItemDetailId"],
          })
        })
          this.SuppliedById = this.dispList.bill.providerId;
           this.OrderedById = this.dispList.bill.receiverId;
           this.billId = this.dispList.bill.billId;
           this.billAmountNoTax = this.dispList.bill.billAmountNoTax;
           this.billAmount =  this.dispList.bill.billAmount;
           this.taxAmount = this.dispList.bill.taxAmount;
           this.Idorder = this.dispList.bill.orderId;
           console.log("SuppliedById", this.SuppliedById)    
           console.log("OrderedById", this.OrderedById)             
  })
  // console.log("SuppliedById", this.SuppliedById)    
  // console.log("OrderedById", this.OrderedById)             
  console.log("array2", this.array)    
  }


  ngOnInit(): void {
    this.order = new OrderModule(2, this.OrdId)
    this.products = [];
    // this.getDispatchList();
    this.getBarcodeProduct();
     this.getStockContainer();
    this.getStoreList();
    //  this.getOrderList("Dispatched");
    // this.products = JSON.parse(localStorage.getItem("Product"));
    this.products.forEach(product => {
      product.quantity = null;
      product.tax = 0;
      product.amount = 0;
    })
  }

  setproductbybarcode(data) {

  }
  barcodereaded(event) {
    console.log(event)
    console.log(event.element.nativeElement.id)
    var product = this.products.filter(x => x.Id == +event.element.nativeElement.id)[0]
    this.inputValue = product.Product;
    this.barcodeItem = product;
    this.barcodeItem.quantity = 1;
    if (this.cartitems.some(x => x.Id == this.barcodeItem["Id"])) {
      this.cartitems.filter(x => x.Id == this.barcodeItem["Id"])[0].quantity += this.barcodeItem.quantity
    } else {
      this.cartitems.push(Object.assign({}, this.barcodeItem));
    }
    this.calculate();
    this.barcodeItem = { quantity: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0, StorageStoreId: null, StorageStoreName: '', BatchNum: null, ContainerCount: this.ContainWgt, ContainerId: this.StockContainerId, ContainerName: '' };
    this.barcValue = ''
  }
  deletenew(index) {
    this.order.Items.splice(index, 1);
    this.order.setbillamount();
  }
  settotalprice(i, qty) {
    this.cartitems[i].amount = this.cartitems[i].Price * this.cartitems[i].DispatchQty;
    this.cartitems[i].tax = this.cartitems[i].amount * (this.cartitems[i].Tax1 + this.cartitems[i].Tax2) / 100;
    console.log(i, this.cartitems[i].Price, this.cartitems[i].DispatchQty, this.cartitems[i].amount, qty)
    this.cartitems[i].amount = +this.cartitems[i].amount.toFixed(2)
    this.calculate();
  }

  calculate() {
    this.subtotal = 0;
    this.tax = 0;
    this.discount = 0
    this.cartitems.forEach(item => {
      console.log(item)
      item.amount = item.price * item.quantity
      item.tax = (item.taxpercent) * item.amount / 100
      item.amount = (+item.amount.toFixed(2)) - item.disc
      this.subtotal += item.price * item.quantity
      this.tax += item.tax
      this.discount += item.disc
      // item.dispatchPrd =item.Product
    })
    this.subtotal = +this.subtotal.toFixed(2)
    this.tax = +this.tax.toFixed(2)
    this.discount = +this.discount.toFixed(2)
    // console.log(this.tax)
  }
  date = new Date();
  onChange(e) {
    console.log("date", e);
    this.orderDate = moment().format('YYYY-MM-DD HH:MM A');
  }
  showModal(): void {
    this.isVisible = true
  }
  dispatch() {

  }
  validation() {
    var isvalid = true;
    if (!this.temporaryItem.productId) isvalid = false;
    if (this.temporaryItem.DispatchQty <= 0) isvalid = false;
    // if (this.temporaryItem.Price <= 0) isvalid = false;
    return isvalid;
  }

  selectedItem(item) {
    console.log(item, Object.assign({}, this.temporaryItem))
    Object.keys(item).forEach(key => {
      this.temporaryItem[key] = item[key]
    })
    console.log(this.temporaryItem)
    this.quantityel['nativeElement'].focus()
  }
  selectItem(item) {
    console.log("item", item)
    this.ContainWgt = item.containerWight;
    this.StockContainerId = item.stockContainerId;
    this.StkContainerName = item.stockContainerName;
    this.createby = item.createdBy;
    this.addItem()
  }
  selecteddispatchitem(item) {
    console.log("item", item);
    this.receiveById = item.id;
  }
  delete(item) {
    console.log("delete",item)
    this.Auth.deletedata(item).subscribe(data => {
      console.log("delete",data)
      })
    }
    
      
  addItem() {
    console.log("temporaryItem", this.temporaryItem)
    this.temporaryItem.ContainerCount = this.ContainWgt;
    this.temporaryItem.ContainerId = this.StockContainerId;
    this.temporaryItem.ContainerName = this.StkContainerName;
    this.temporaryItem.StorageStoreId = this.StoreId;
    this.submitted = true;
    if (this.validation()) {
      if (this.order.Items.some(x => x.BarcodeId == this.temporaryItem["barcodeId"])) {
        this.order.Items.filter(x => x.BarcodeId == this.temporaryItem["barcodeId"])[0].OrderQuantity += this.temporaryItem.Quantity
        this.order.Items.filter(x => x.BarcodeId == this.temporaryItem["barcodeId"])[0].OrderQuantity += this.temporaryItem.Quantity
        this.order.setbillamount()
      } else {
        this.order.FoodReady =this.FoodReady;
        this.order.OrderType = this.OrderType;
        this.order.SpecialOrder =this.SpecialOrder;
        this.order.DiscAmount =this.DiscAmount;
        this.order.DiscPercent =this.DiscPercent;
        this.order.PreviousStatusId =this.PreviousStatusId;
                this.order.ProdStatus = "1";
                this.order.WipStatus = "1"    
                this.order.Id = this.Idorder;
                this.order.SuppliedById = this.SuppliedById;
                this.order.OrderedById = this.OrderedById;
                this.order.StoreId = this.StoreId;
                this.order.OrderedDateTime =moment().format('YYYY-MM-DD HH:MM A');
                this.order.OrderedDate =moment().format('YYYY-MM-DD HH:MM A');
                this.order.CreatedDate =moment().format('YYYY-MM-DD HH:MM A');    
                this.order.BillDate =moment().format('YYYY-MM-DD HH:MM A');    
                this.order.BillDateTime =moment().format('YYYY-MM-DD HH:MM A');            
        this.order.addproduct(this.temporaryItem, this.Idorder, this.StoreId)
      }
      this.products.forEach(prod => {
        if (prod.barcodeId == this.temporaryItem["barcodeId"]) {
          prod.quantity -= this.temporaryItem.DispatchQty
          prod.ContainerCount = this.ContainWgt
          prod.ContainerId = this.StockContainerId
          prod.ContainerName = this.StkContainerName
        }
        // prod.product =this.temporaryItem.dispatchPrd;
        // prod.productId =this.temporaryItem.dispatchPrdId;
      });
      this.temporaryItem = { DiscAmount: 0, DispatchQty: null, DiscPercent: 0 };
      this.productinput['nativeElement'].focus()
      this.model = "";
      this.filteredvalues = [];
      this.submitted = false;
      // console.log(this.order)
      return
    }
  }

  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log(this.stores)
    })
  }
  receive() {
    console.log("array",this.array)
    console.log("supplier",this.SuppliedById)
    var finalarray = [...this.array, ...this.order.Items]
    this.RecData = new ReceiveModule(this.Idorder,this.billId, this.OrderedById, this.SuppliedById, this.receiveById, this.dispatchTypeId, finalarray, this.orderDate, this.users, this.createby,
      this.billAmountNoTax,this.billAmount,this.taxAmount,this.order.OrderDetail)
    console.log("finalarray", finalarray)
    console.log("receive", this.RecData)
    console.log("finalarray", finalarray)
    // this.Auth.receive(this.RecData).subscribe(data => {
    //   console.log("temporry", data)
    //  })
        this.Auth.Ordrecve(this.RecData).subscribe(data => {
      console.log("temporry", data)
     })
      this.router.navigate(['/apps/internaltransfer']);
  }
  openDetailpopup(contentdetail,id)
  {
    this.Ordprd.push({
      companyId:this.CompanyId,
      orderId:id,
      UserId:this.users[0].id,
      dispatchType:this.dispatchType,
      billStatus:this.billStatus,
      NumRecords:this.numRecordsStr
    })
   this.Auth.getorder(this.Ordprd).subscribe(data => {
     this.popupData = data;
     console.log("popupData",this.popupData)
   })
   this.TotalProductSale =0;
   this.TotalPrdQty =0;

   for (let i = 0; i < this.popupData.order.length; i++) {
     this.TotalProductSale = this.TotalProductSale + this.popupData.order[i].totalsales;
     this.TotalPrdQty = this.TotalPrdQty + this.popupData.order[i].qty;
     this.TotalProductSale = +(this.TotalProductSale.toFixed(2))
     this.TotalPrdQty = +(this.TotalPrdQty.toFixed(2))  
   }
   const modalRef = this.modalService
     .open(contentdetail, {
       ariaLabelledBy: "modal-basic-title",
       centered: true
     })
     .result.then(
       result => {
       },
       reason => {
       }
     );
     }

}
