import { ɵSafeHtml } from '@angular/core'
import { SafeHtml } from '@angular/platform-browser'
import moment from 'moment'
import { getUser } from 'src/app/store/user/reducers'
export class OrderModule {
  AggregatorOrderId: string
  AllItemDisc: number
  AllItemTaxDisc: number
  AllItemTotalDisc: number
  additionalchargearray: Array<AdditionalCharge> = []
  BillAmount: number
  BillStatusId: number
  BillDateTime: string
  BillDate: string
  changeditems: Array<string>
  createdtimestamp: number
  CustomerData: string
  CompanyId: number
  CustomerId: number
  CustomerDetails: CustomerModule
  ChargeJson: string
  Charges: number
  Closed: boolean = false
  CancelStatus: number
  CreatedDate: string
  DiscPercent: number
  DiscAmount: number
  DeliveryDateTime: string
  DispatchStatus: number
  DifferentPercent: number
  events: Array<any>
  Id: number
  InvoiceNo: string
  isordersaved: boolean
  IsAdvanceOrder: boolean = false
  ItemJson: string
  Items: Array<OrderItemModule>
  ModifiedDate: string
  OrderItemModule: any
  OrderNo: number
  OrderTypeId: number
  OrderStatusId: number
  OrderId: number
  OrderJson: string
  OrderedDateTime: string
  OrderedDate: string
  OrderStatusDetails: string
  OrderDiscount: number
  OrderTaxDisc: number
  OrderTotDisc: number
  OrderedById: number
  OrderStatus: number
  OrderType: number
  ProdStatus: string
  PreviousStatusId: number
  PaidAmount: number
  Quantity: number
  RefundAmount: number
  RiderStatusDetails: string
  ReceiveStatus: number
  SourceId: number
  Source: string
  StoreId: number
  SplitTableId: number
  subtotal: number
  StorePaymentTypeId: number
  StorePaymentTypeName: string
  SuppliedById: number
  SpecialOrder: boolean = false
  Subtotal: number
  Tax1: number
  Tax2: number
  Tax3: number
  Transactions: Array<Transaction>
  TaxAmount: number
  Updated: boolean = false
  UPOrderId: string
  UserId: number
  WipStatus: string

  constructor(ordertype) {
    this.AggregatorOrderId = ''
    this.AllItemDisc = 0
    this.AllItemTaxDisc = 0
    this.AllItemTotalDisc = 0
    this.BillStatusId = 0
    this.BillAmount = 0
    this.BillDateTime = ''
    this.BillDate = ''
    this.ChargeJson = ''
    this.Charges = 0
    this.changeditems = []
    this.CustomerData = ''
    this.Closed = false
    this.CancelStatus = 0
    this.CreatedDate = ''
    this.CustomerId = 0
    this.CompanyId = 0
    this.CustomerDetails = new CustomerModule()
    this.DiscPercent = 0
    this.DiscAmount = 0
    this.DeliveryDateTime = ''
    this.DifferentPercent = 0
    this.DispatchStatus = 0
    this.Items = []
    this.InvoiceNo = ''
    this.IsAdvanceOrder = false
    this.isordersaved = false
    this.ItemJson = ''
    this.ModifiedDate = ''
    this.OrderedById = 0
    this.OrderStatus = 0
    this.OrderId = 0
    this.OrderStatusId = 0
    this.OrderNo = 0
    this.OrderedDateTime = ''
    this.OrderedDate = ''
    this.OrderStatusDetails = ''
    this.OrderDiscount = 0
    this.OrderTaxDisc = 0
    this.OrderTotDisc = 0
    this.OrderType = ordertype
    this.ProdStatus = ''
    this.PreviousStatusId = 0
    this.PaidAmount = 0
    this.RefundAmount = 0
    this.RiderStatusDetails = ''
    this.ReceiveStatus = 0
    this.SourceId = 0
    this.StoreId = 0
    this.subtotal = 0
    this.StorePaymentTypeId = 0
    this.StorePaymentTypeName = ''
    this.Source = ''
    this.SplitTableId = 0
    this.SuppliedById = 0
    this.SpecialOrder = false
    this.Transactions = []
    this.Tax1 = 0
    this.Tax2 = 0
    this.Tax3 = 0
    this.Updated = false
    this.UPOrderId = ''
    this.UserId = this.UserId
    this.WipStatus = ''
  }

  addproduct(product,showname) {
    console.log(product)
    this.Items.push(new OrderItemModule(product, showname))
    this.setbillamount()
  }
  setbillamount() {
    if (!this.isordersaved) this.PaidAmount = 0
    var extracharge = 0
    this.AllItemDisc = 0
    this.AllItemTaxDisc = 0
    this.AllItemTotalDisc = 0
    this.BillAmount = 0
    this.DiscAmount = this.DiscAmount ? this.DiscAmount : 0
    this.Subtotal = 0
    this.TaxAmount = 0
    this.StorePaymentTypeId = 0

    this.Tax1 = 0
    this.Tax2 = 0
    this.Tax3 = 0
    this.Items.forEach(item => {
      console.log(item)
      item.TotalAmount = item.Price * item.OrderQuantity
      if (item.IsInclusive) {
        item.TotalAmount = item.TotalAmount - (item.TotalAmount * (item.Tax1 + item.Tax2 + item.Tax3)) / 100
      }
      item.TaxAmount1 = (item.Tax1 * item.TotalAmount) / 100
      item.TaxAmount2 = (item.Tax2 * item.TotalAmount) / 100
      item.TaxAmount3 = (item.Tax3 * item.TotalAmount) / 100
      item.TaxAmount = item.TaxAmount1 + item.TaxAmount2 + item.TaxAmount3
      console.log(item.DiscPercent, item.DiscAmount)

      if (item.DiscPercent > 0)
        item.DiscAmount = (this.DiscAmount * 100) / (this.BillAmount + this.TaxAmount)

      console.log(item.DiscPercent, item.DiscAmount)
      console.log(this.BillAmount)
      this.BillAmount += item.TotalAmount
      this.Subtotal += item.TotalAmount
      this.Tax1 += item.TaxAmount1
      this.Tax2 += item.TaxAmount2
      this.Tax3 += item.TaxAmount3
      this.TaxAmount += item.TaxAmount
      this.DiscAmount += item.DiscAmount
    })

    this.BillAmount = this.Subtotal + this.Tax1 + this.Tax2 + this.Tax3 - this.DiscAmount
    this.BillAmount = +(+this.BillAmount.toFixed(0)).toFixed(2)

    // this.additionalchargearray.forEach(charge => {
    //   // console.log(charge.Description, charge.selected)
    //   if (charge.selected) {
    //     if (charge.ChargeType == 2) {
    //       charge.Amount = Number((this.BillAmount / 100) * charge.ChargeValue)
    //     } else {
    //       charge.Amount = Number(charge.ChargeValue)
    //     }
    //     extracharge += charge.Amount
    //     this.Charges += charge.Amount
    //   }
    // })
  }
}

export class Transaction {
  // Id: number
  Amount: number
  CustomerId: number
  CompanyId: number
  InvoiceNo: string
  OrderId: number
  PaymentTypeId: number
  PaymentStatusId: number
  StorePaymentTypeId: number
  StoreId: number
  StorePaymentTypeName: string
  saved: boolean = false
  TranstypeId: number
  TransDateTime: string
  TransDate: string
  UserId: number
  Remaining: number

  constructor(amount = 0, spt = 0) {
    this.Amount = amount
    this.CompanyId = 0
    this.CustomerId = 0
    this.InvoiceNo = ''
    this.OrderId = 0
    this.PaymentStatusId = 0
    this.PaymentTypeId = 6
    this.StorePaymentTypeId = spt
    this.StoreId = 0
    this.StorePaymentTypeName = ''
    this.TranstypeId = 0
  }
}

export class OrderItemModule {
  Amount: number
  BillId: number
  baseprice: number
  BarcodeId: number
  CompanyId: number = 1
  ComplementryQty: number
  CancelledQuantity: number
  CreatedDate: string
  CurrentStock: number
  DiscPercent: number
  DiscAmount: number
  DispatchedQuantity: number
  DispatchLaterQuantity: number
  Extra: number
  Id: number
  ItemDiscount: number
  IsInclusive: boolean
  _id: string
  Message: string
  OrderItemId: number
  OrderId: number
  OrderDiscount: number
  OptionJson: string
  OrderQuantity: number
  OrderLevel: number
  OldStock: number
  PendingQty: number
  ProductName: string
  Price: number
  ProductId: number
  // quantity: number
  ReceivedQuantity: number
  ReturnedQuantity: number
  ReceiveLaterQuantity: number
  StatusId: number
  showname: SafeHtml
  stockBatchId: number
  TaxItemDiscount: number
  TaxOrderDiscount: number
  TotalAmount: number
  TaxAmount: number
  Tax1: number
  Tax2: number
  Tax3: number
  Tax4: number
  TaxAmount1: number
  TaxAmount2: number
  TaxAmount3: number
  Updated: boolean = false
  VarianceReasonStr: string
  VarianceReasonDesc: string
  quantity: number
  maxQty: number = 0
  constructor(product, showname) {
    console.log(product)
    this.maxQty = product.maxqty
    this.Amount = 0
    this.BillId = 0
    this.BarcodeId = product.barcodeId
    this.CancelledQuantity = 0
    // this.CreatedDate = ''
    this.CurrentStock = 0
    this.ComplementryQty = 0
    this.CompanyId = 1
    this.DispatchedQuantity = 0
    this.DispatchLaterQuantity = 0
    this.DiscPercent = product.DiscPercent
    this.DiscAmount = product.DiscAmount
    this.Extra = 0
    this.Id = 0
    this.ItemDiscount = 0
    this.IsInclusive = product.isInclusive == 'true' || product.isInclusive == true
    this._id = product._id
    this.Message = ''
    this.OrderDiscount = 0
    this.OptionJson = ''
    this.OrderItemId = 0
    this.OrderId = 0
    this.OrderLevel = 0
    this.OldStock = 0
    this.OrderQuantity = product.Quantity
    this.ProductName = product.product
    this.ProductId = product.productId
    this.PendingQty = 0
    this.Price = +product.price
    // console.log(this.quantity)
    this.quantity = product.quantity

    this.ReceivedQuantity = 0
    this.ReturnedQuantity = 0
    this.ReceiveLaterQuantity = 0
    this.showname = showname
    this.StatusId = 0
    this.stockBatchId = +product.stockBatchId
    this.TaxItemDiscount = 0
    this.TaxOrderDiscount = 0
    this.TotalAmount = 0
    this.TaxAmount = 0
    this.Tax1 = +product.tax1
    this.Tax2 = +product.tax2
    this.Tax3 = +product.tax3
    this.Tax4 = 0
    this.Updated = false
    this.VarianceReasonStr = '1'
    this.VarianceReasonDesc = ''
  }
}

export class OrderItemDetailModule {
  OrderItemDetailId: number
  Id: number
  ActualProdId: number
  BatchId: number
  BillId: number
  OrdProdType: number
  StorageStoreId: number
  ContatinerId: number
  ContainerCount: number
  Quantity: number
  UnitPrice: number
  Tax1: number
  Tax2: number
  Amount: number
  TaxAmount: number
  Date: string
  DateTime: string
  RelatedOrderId: string
  CreatedDate: string
  CreatedBy: number
  DiscAmount: number
  DiscPercent: number
  DiscPerQty: number
  AutoOrderId: number
  CompanyId: number
  VarianceReasonStr: string
  VarianceReasonDesc: string
  constructor(product, options, showname) {
    this.OrderItemDetailId = 0
    this.Id = 0
    this.ActualProdId = 0
    this.BatchId = 0
    this.BillId = 0
    this.OrdProdType = 0
    this.StorageStoreId = 0
    this.ContatinerId = 0
    this.ContainerCount = 0
    this.Quantity = 0
    this.UnitPrice = 0
    this.Tax1 = 0
    this.Tax2 = 0
    this.Amount = 0
    this.TaxAmount = 0
    this.Date = ''
    this.DateTime = ''
    this.RelatedOrderId = ''
    // this.CreatedDate = ''
    this.CreatedBy = 0
    this.DiscAmount = 0
    this.DiscPercent = 0
    this.DiscPerQty = 0
    this.AutoOrderId = 0
    this.CompanyId = 1
    this.VarianceReasonStr = ''
    this.VarianceReasonDesc = ''
  }
}
export class CustomerModule {
  Id: number
  Name: string
  Email: string
  PhoneNo: string
  Address: string
  City: string
  PostalCode: number
  CompanyId: number
  StoreId: number
  val: number
  CreatedDate: string
  datastatus: string
  constructor() {
    this.Id = null
    this.Name = ''
    this.Email = ''
    // this.CreatedDate = ''
    this.PhoneNo = ''
    this.Address = ''
    this.City = ''
    this.PostalCode = null
    this.CompanyId = 0
    this.StoreId = 0
  }
}

export class AdditionalCharge {
  Id: number
  Amount: number
  ChargeType: number
  ChargeValue: number
  Description: string
  TaxGroupId: number
  selected: boolean
  constructor(charge) {
    this.Id = charge.Id
    this.Amount = 0
    this.ChargeType = charge.ChargeType
    this.ChargeValue = charge.ChargeValue
    this.Description = charge.Description
    this.TaxGroupId = charge.TaxGroupId
    this.selected = charge.selected
  }
}
