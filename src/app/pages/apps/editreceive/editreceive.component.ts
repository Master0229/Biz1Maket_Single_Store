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
import { OrderItemModule, OrderModule, ReceiveModule } from './editreceive.module';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Location } from '@angular/common';

@Component({
  selector: 'app-editreceive',
  templateUrl: './editreceive.component.html',
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
export class EditreceiveComponent implements OnInit {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any>;//productinput
  @ViewChild('discper', { static: false }) public discperel: TemplateRef<any>;
  @ViewChild('disc', { static: false }) public discel: TemplateRef<any>;
  // @ViewChild('instance2', { static: true }) instance2: NgbTypeahead
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>;
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;

  model: any = 'QWERTY'
  order: OrderModule
  Disp: ReceiveModule
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
  // OrderedByName:'';
  // OrderedById:null;
  // SuppliedById:null;
  // SupplierName:'';
  scrollContainer: any;
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
  DispatchById = null;
  discount = 0;
  isVisible = false;
  batchno = 5;
  isShown = false;
  EditTable = true;
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
  Idorder =0;
  CancelStatus = 0;
  ProdStatus = '';
  DispatchStatus = 0;
  ReceiveStatus = 0;
  OrderStatusId = 0;
  OrderedById = 0;
  SuppliedById = 0;
  receivedById = 0;
  FoodReady = true;
  OrderType = 2;
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
  billId = null
  billAmountNoTax = null
 billAmount =  null;
  taxAmount = null;
  orderId = null;
  receiveDate ='';
  orderType ='Receiver';
  orderStatus =null;
  numRecordsStr =50;
  dispatchStatus = 1;
  Ordprd:any =[];
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
  array: any = [];
  ProductId =0;
  WipStatus ='';
  displayprd:any =[];
  dispList:any =[];
  bill = 0;
  receivedBy:'';
  // quantityfc = new FormControl('', [Validators.required, Validators.min(1)]);


  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
     private router: Router ,
    private _avRoute: ActivatedRoute,
    public location: Location) {

    this.bill = this._avRoute.snapshot.params["id"];
    this.users = JSON.parse(localStorage.getItem("users"));

  }
  newselectedItem(item)
  {
    console.log("item",item)
     this.ProductId =item.productId;
  }
  selectedsupplieritem(item) {
    console.log("item",item);
    this.receivedById =item.id;
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

    getReceiveList() {

      this.displayprd.push({
        compId:this.CompanyId,
        billId:this.bill
      })
      console.log("data",this.displayprd)
      this.Auth.getReceivePrd( this.displayprd).subscribe(data => {
        console.log("dispList", data)
        this.dispList = data;
        this.dispList.orderProductDetList.forEach(element => {
          element.receiveProduct = this.dispList.receiveProductList.filter(x => x.receiveProductId == element.actualProdId)[0].receiveProduct 
          element.OrdId = this.dispList.bill.orderId;
        });
                this.dispList.orderItem.forEach(element => {
            element.Action = "Chk";
            element.updated = false;
            element["updated"] = false;
            element["ordItemType"] = 3;
            // element["OrdItemDetailId"] = element.id
            // element["OrderItemId"] = element.orderItemId
            // element["StorageStoreId"] = element.dispatchStorageId
            //  element["DispatchProductId"] = element.actualProdId
            //  element["ProductId"] = element.productId
          // element["Dispatchprd"] = element.receiveProduct
          //    element["ProductName"] = element.receiveProduct
          //   element["Pricee"] = element.unitPrice
            // element["Tax1"] = element.tax1
            // element["Tax2"] = element.tax2
            // element["Amount"] = element.amount
            // element["Action"] = 'Chk'
            this.array.push({
              // StorageStoreId: element["StorageStoreId"],
              // companyId: element["companyId"],
              // ContainerId: element["containerId"],
              // ContainerWeight: element["containerWeight"],
              OrderItemType: element["ordItemType"],
              OpenQty: element["quantity"],
              GrossQty: element["quantity"],
              DispatchQty: element["quantity"],
              OrderQuantity: element["quantity"],
               DispatchProductId: element["productId"],
               ProductId: element["productId"],
              //  Dispatchprd: element["Dispatchprd"],
              //  ProductName: element["ProductName"],
              Price: element["price"],
              Tax1: element["tax1"],
              Tax2: element["tax2"],
              Tax3: element["tax3"],
              Tax4: element["tax3"],
              Amount: element["amount"],
              Action: element["Action"],
              OrderItemId: element["orderItemId"],
              OrderItemDetailId: element["id"],
              Updated: element["updated"],
              CompanyId: element["companyId"],
              Quantity: element["quantity"],
              OrderItemRefId: element["orderItemRefId"],
              RefId: element["refId"],
              OrdItemDetailId: element["orderItemDetailId"],  
              // StorageStoreId: element["receiveStorageId"],
            })
          })
            this.SuppliedById = this.dispList.bill.providerId;
             this.OrderedById = this.dispList.bill.receiverId;
             this.billId = this.dispList.bill.billId;
             this.billAmountNoTax = this.dispList.bill.billAmountNoTax;
             this.billAmount =  this.dispList.bill.billAmount;
             this.taxAmount = this.dispList.bill.taxAmount;
             this.orderId = this.dispList.bill.orderId;
             this.receivedById = this.dispList.bill.receivedById;
             this.receivedBy = this.dispList.bill.name;
             this.receiveDate = this.dispList.bill.billDate;
             this.Idorder = this.dispList.bill.orderId;
      })
    }
  
    getord() {
      {
        this.Ordprd.push({
          companyId:this.CompanyId,
          searchId:this.ordId,
          UserID:this.users[0].id,
          orderType:this.orderType,
          orderStatus:this.orderStatus,
          numRecordsStr:this.numRecordsStr,
          dispatchStatus:this.dispatchStatus
        })
        this.Auth.getorder(this.Ordprd).subscribe(data => {
        this.ordDetails = data;
        console.log("datarrr",this.ordDetails)
      })
  }
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

  ngOnInit(): void {
    console.log("Id",this.bill)
    this.order = new OrderModule(2, this.OrdId)
    this.products = [];
    this.getBarcodeProduct();
    this.getStockContainer();
    this.getStoreList();
    this.getord();
    this.getReceiveList();
    // this.products = JSON.parse(localStorage.getItem("Product"));
    this.products.forEach(product => {
      product.quantity = null;
      product.tax = 0;
      product.amount = 0;
    })
  }
  getOrderList() {
    // this.Ordprd.push({
    //   companyId:this.CompanyId,
    //   orderId:this.ordId,
    //   UserId:this.users[0].id,
    //   dispatchType:this.dispatchType,
    //   billStatus:this.billStatus,
    //   NumRecords:this.numRecordsStr,
    // })
    this.Auth.getorder(this.Ordprd).subscribe(data => {
      this.OrdData = data;
      console.log("OrdData", this.OrdData)
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
  delete(item) {
console.log("delete",item)
this.Auth.deleteItem(item).subscribe(data => {
  console.log("delete",data)
  this.getReceiveList();
  })
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
  dropdownnew(Value) {
    console.log("Value",Value)
    this.WipStatus = Value;
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
    // this.quantityel['nativeElement'].focus()
  }
  selectItem(item) {
    console.log("item", item)
    // console.log(item,Object.assign({},this.temporaryItem))
    // Object.keys(item).forEach(key => {
    //   this.temporaryItem[key] = item[key]
    // })
    // console.log(this.temporaryItem)
    this.ContainWgt = item.containerWight;
    this.StockContainerId = item.stockContainerId;
    this.StkContainerName = item.stockContainerName;
    this.createby = item.createdBy;
    this.addItem()
  }
  selecteddispatchitem(item) {
    console.log("item", item);
    this.DispatchById = item.id;
    // this.order.push({OrdNo:item.id})
  }
  addItem() {
    console.log("temporaryItem", this.temporaryItem)
    // this.submitted = true;
    // console.log(this.validation())
    // if (this.validation()) {
    //   this.order.addproduct(this.temporaryItem)
    //   this.temporaryItem = { DiscAmount: 0, Quantity: null };
    //   this.productinput['nativeElement'].focus()
    //   this.model = "";
    //   this.filteredvalues = [];
    //   this.submitted = false;
    //   console.log("cvcv",this.order)
    //   return
    // } 
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
  receiveStk(id) {
    console.log(id)
    this.Auth.editInternalord(id).subscribe(data => {
      console.log(data)
      this.getOrderList();
    })
  }
  addQty(qty,item)
  {
    console.log("addQty",qty,item)
    this.ordPrdDetails.dispatchList.forEach(element => {
      if(element.id ==item.id)
      {
        console.log("Qty",qty,item.id)
        element.openQuantity = qty;
      };
      return element;
    })
     this.getord();
  }
  addPrice(price,item)
  {
    console.log("addprice",price,item)
    this.ordPrdDetails.dispatchList.forEach(element => {
      if(element.id ==item.id)
      {
        console.log("price",price,item.id)
        element.Price = price;0
      };
      return element;
    })
     this.getord();
  }
  addTax1(Tax,item)
  {
    console.log("addprice",Tax,item)
    this.ordPrdDetails.dispatchList.forEach(element => {
      if(element.id ==item.id)
      {
        console.log("Tax",Tax,item.id)
        element.Tax1 = Tax;
      };
      return element;
    })
     this.getord();
  }
  addTax2(Tax,item)
  {
    console.log("addprice",Tax,item)
    this.ordPrdDetails.dispatchList.forEach(element => {
      if(element.id ==item.id)
      {
        console.log("price",Tax,item.id)
        element.Tax2 = Tax;
      };
      return element;
    })
     this.getord();
  }
  addTax3(Tax,item)
  {
    console.log("Tax",Tax,item)
    this.ordPrdDetails.dispatchList.forEach(element => {
      if(element.id ==item.id)
      {
        console.log("price",Tax,item.id)
        element.Tax3 = Tax;
      };
      return element;
    })
     this.getord();
  }
  addBatch(price,item)
  {
    console.log("addprice",price,item)
    this.ordPrdDetails.dispatchList.forEach(element => {
      if(element.id ==item.id)
      {
        console.log("price",price,item.id)
        element.Price = price;
      };
      return element;
    })
     this.getord();
  }

  UpdateReceive() {
    var finalarray = [...this.array, ...this.order.Items]
    this.Disp = new ReceiveModule(this.Idorder, this.OrderedById, this.SuppliedById, this.DispatchById, this.receivedById, finalarray, this.orderDate, 
      this.users, this.createby,this.WipStatus,this.billId,this.billAmount,
      this.billAmountNoTax,this.taxAmount,this.receiveDate,this.order.OrderDetail)
    console.log("finalarray", finalarray)
      console.log("finalarray", this.Disp)
    this.order.Id = this.OrdId;
    this.order.add(this.temporaryItem)
        this.Auth.UpdateReceiveOrd(this.Disp).subscribe(data => {
     console.log("temporry", data)
        })
    // this.Auth.UpdateReceive(this.Disp).subscribe(data => {
    //  console.log("temporry", data)
      this.isShown = !this.isShown
      this.EditTable = !this.EditTable
    this.router.navigate(['/apps/internaltransfer']);
      this.getOrderList();
    //  })
  }
  openDetailpopup(contentdetail,id)
  {
    this.Ordprd.push({
      companyId:this.CompanyId,
      orderId:id,
      UserId:this.users[0].id,
          orderType:this.orderType,
          orderStatus:this.orderStatus,
          numRecordsStr:this.numRecordsStr,
          dispatchStatus:this.dispatchStatus
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
