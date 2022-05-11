import { Component, OnInit } from '@angular/core'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service'
import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd/i18n'
import { getISOWeek } from 'date-fns'
import {
  NgbDate,
  NgbDateStruct,
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment'
import {
  NzPlacementType,
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown'
import { OrderModule } from '../sale/sale.module'
import { PrintService } from 'src/app/services/print/print.service'
@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit {
  dateRange = []
  Company: any
  ContactNo: any
  preferences = { ShowTaxonBill: true }
  customer: any
  filteredcustomer: any
  Store: any
  Address: any
  City: any
  GSTno: any
  CustomerDetails: any
  DiscAmount: any
  BillAmount: number
  InvoiceNo: any
  OrderedDateTime: any
  phoneNo: any
  name: any

  onChange(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')
    this.getReceipt()
    // this.gettrans()
  }
  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result))
  }
  model: NgbDateStruct
  date: { year: number; month: number }
  public buttonName: any = 'Back'
  value: string
  selectedValue = 'All'
  receipts: any
  show: number = 0
  orderitem: any
  term
  orderno: any
  Subtotal: number = 0
  Total: number = 0
  element: any
  orderid: any
  CompanyId: any
  StoreId: any
  UserId: number
  OrderStauts: number
  systemPrinters: any
  strdate: string
  enddate: string
  user: any
  id = 1
  trans: any
  loginfo
  showcalendar = false
  roleid
  hoveredDate: NgbDate | null = null
  fromDate: NgbDate
  toDate: NgbDate | null = null
  invoice = null
  totalsales: number = 0
  totalpayments: number = 0
  transactionpayment = 0
  totalrefund: number = 0
  paymentpercent
  transactions: any
  OrderId = null
  Discount: number
  address: any
  city: any
  phone: any
  orderedDate: any
  AdditionalCharges: any = []
  PaidAmount: any
  masterdata = []


  constructor(
    private i18n: NzI18nService,
    private Auth: AuthService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private printservice: PrintService,
  ) {




    this.fromDate = calendar.getToday()
    this.toDate = calendar.getToday()
  }

  transaction: {
    Amount: number
    OrderId: number
    CompanyId: number
    StoreId: number
    PaymentTypeId: number
    CustomerId: number
    UserId: number
    ContactId: number
  }

  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'printersettings']).subscribe(data => {
      const user = JSON.parse(localStorage.getItem("user"))
      this.loginfo = data['loginfo'][0]
      this.printersettings = data['printersettings'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      this.roleid = user.roleId
      console.log(this.roleid)
      console.log(this.loginfo)
      this.transaction = {
        Amount: 0,
        OrderId: 0,
        CompanyId: this.CompanyId,
        StoreId: this.StoreId,
        PaymentTypeId: 0,
        CustomerId: 0,
        UserId: this.UserId,
        ContactId: null
      }

    })
    this.strdate = moment().format('YYYY-MM-DD')
    this.enddate = moment().format('YYYY-MM-DD')
    this.getReceipt()
    // this.gettrans()

    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data

      this.getReceipt()
    })
  }

  toggle() {
    if (this.show) this.buttonName = 'Back'
    else this.buttonName = 'Back'
  }
  openOrderpopup(orderDetail) {
    const modalRef = this.modalService
      .open(orderDetail, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        result => { },
        reason => { },
      )
  }

  timeout: any = null
  onKeySearch() {
    clearTimeout(this.timeout)
    var $this = this
    this.timeout = setTimeout(function () {
      $this.search()
    }, 500)
  }
  search() {
    if (this.term == '' || this.term == null) {
      this.receipts.receipts = this.masterdata
    } else {
      this.receipts.receipts = this.masterdata.filter(x =>
        x.invoiceNo.toLowerCase().includes(this.term.toLowerCase()),
      )
    }
  }



  getReceipt() {
    this.Auth.GetReceipts(this.StoreId, this.strdate, this.enddate, this.invoice).subscribe(
      data => {
        this.totalsales = 0
        this.totalpayments = 0
        this.totalrefund = 0
        this.receipts = data
        this.transactionpayment = 0
        console.log(this.receipts)

        this.receipts.receipts.forEach(rec => {
          this.totalsales += +rec.totalSales.toFixed(0)
          this.totalpayments += +rec.totalPayment.toFixed(0)
          this.totalrefund += +rec.totalRefund.toFixed(0)
        })
        console.log(this.totalsales)
        console.log(this.totalpayments)
        console.log(this.totalrefund)
        this.masterdata = this.receipts.receipts
      },
    )
  }
  // gettrans() {
  //   this.Auth.gettransaction(this.OrderId).subscribe(data => {
  //     this.transactions = data
  //     console.log(this.transactions)
  //   })
  // }

  parseOrder(order) {
    this.order = { ...JSON.parse(order.orderJson), OrderId: order.orderId }
    console.log(this.order)
    this.show = 1
  }



  cancel() {
    this.transaction.Amount = -this.order.BillAmount
    this.transaction.OrderId = this.order.OrderId
    this.transaction.CompanyId = this.order.CompanyId
    // this.transaction.PaymentTypeId = 2
    this.transaction.CustomerId = this.order.CustomerDetails?.Id
    this.transaction.ContactId = this.order.CustomerDetails?.Id
    this.transaction.UserId = this.order.UserId
    var data = { value: this.transaction }
    console.log(this.transaction.OrderId, this.transaction.Amount, this.transaction.CustomerId)
    // return
    this.Auth.refund(data).subscribe(data => {
      console.log(data)
      this.getReceipt()
      this.show = 0
    })
  }


  CGST: number = 0
  SGST: number = 0
  IGST: number = 0
  ordertype = ''
  remaining: number

  order: OrderModule = null
  filter(id, PaidAmount) {
    console.log(this.order)
    this.PaidAmount = PaidAmount
    this.Subtotal = 0
    this.CGST = +(this.receipts.receipts.filter(x => x.Id == id)[0].Tax1).toFixed(2)
    this.SGST = +(this.receipts.receipts.filter(x => x.Id == id)[0].Tax2).toFixed(2)
    this.IGST = this.receipts.receipts.filter(x => x.Id == id)[0].Tax3
    this.address = this.receipts.receipts.filter(x => x.Id == id)[0].Address
    this.city = this.receipts.receipts.filter(x => x.Id == id)[0].City
    this.phone = this.receipts.receipts.filter(x => x.Id == id)[0].PhoneNo
    this.orderedDate = this.receipts.receipts.filter(x => x.Id == id)[0].OrderedDateTime
    this.Total = 0
    this.Discount = this.receipts.receipts.filter(x => x.Id == id)[0].DiscAmount
    this.orderno = this.receipts.receipts.filter(x => x.Id == id)[0].InvoiceNo
    this.ordertype = this.receipts.receipts.filter(x => x.Id == id)[0].OrderType

    var ordItemArr = JSON.parse(
      JSON.stringify(this.receipts.orderItems.filter(x => x.OrderId == id)),
    )
    this.orderitem = []
    console.log(ordItemArr)
    ordItemArr.forEach(element => {
      if (this.orderitem.some(x => x.Description === element.Description)) {
        if (element.StatusId == -1) {
          this.orderitem.filter(x => x.Description === element.Description)[0].Quantity =
            this.orderitem.filter(x => x.Description === element.Description)[0].Quantity +
            element.Quantity
          this.orderitem.filter(x => x.Description === element.Description)[0].Price =
            this.orderitem.filter(x => x.Description === element.Description)[0].Price -
            element.Price
        } else {
          this.orderitem.filter(x => x.Description === element.Description)[0].Quantity =
            this.orderitem.filter(x => x.Description === element.Description)[0].Quantity +
            element.Quantity
          this.orderitem.filter(x => x.Description === element.Description)[0].Price =
            this.orderitem.filter(x => x.Description === element.Description)[0].Price +
            element.Price
        }
      } else {
        this.orderitem.push(element)
      }
    })
    this.orderitem = this.orderitem.filter(x => x.Quantity + x.ComplementryQty > 0)

    this.transactions = this.receipts.Transaction.filter(x => x.OrderId == id)
    if (this.transactions[0] != undefined) {
      this.customer = this.receipts.Customers.filter(
        x => x.Id == this.transactions[0].CustomerId,
      )[0]
    }
    if (this.customer == undefined) {
      this.customer = { Name: '-', PhoneNo: '-', Address: '-', City: '-' }
    }
    for (let i = 0; i < this.transactions.length; i++) {
      this.transactions[i].TransDateTime = moment(this.transactions[i].TransDateTime).format('LLL')
    }
    console.log(this.customer)
    var st = 0
    for (let i = 0; i < this.orderitem.length; i++) {
      this.Subtotal += this.orderitem[i].Quantity > 0 ? this.orderitem[i].TotalAmount : 0
      st += this.orderitem[i].Quantity > 0 ? this.orderitem[i].TotalAmount : 0
      console.log(this.orderitem[i].Quantity, this.orderitem[i].TotalAmount, st, this.Subtotal)
    }

    this.Total =
      this.CGST + this.SGST + this.IGST + this.Subtotal - this.Discount
    this.Total = +this.Total.toFixed(0)
    this.transaction.Amount = this.Total - this.PaidAmount
    this.remaining = this.Total - this.PaidAmount
    this.element = document.getElementById('qqq') as HTMLElement
  }


  print1() {
    var PrintCommandObject = null
    PrintCommandObject.ExecWB(6, 2)
    function printPage() {
      // console.log(PrintCommandObject)
      if (PrintCommandObject) {
        try {
          PrintCommandObject.ExecWB(6, 2)
          PrintCommandObject.outerHTML = ''
        } catch (e) {
          alert(e)
          window.print()
        }
      } else {
        window.print()
      }
    }
  }
  printersettings = { receiptprinter: '' }
  printhtmlstyle = `
  <style>
    #printelement {
      width: 270px;
    }
    .header {
        text-align: center;
    }
    .item-table {
        width: 100%;
    }
    .text-right {
      text-align: right!important;
    }
    .text-left {
      text-align: left!important;
    }
    .text-center {
      text-align: center!important;
    }
    tr.nb, thead.nb {
        border-top: 0px;
        border-bottom: 0px;
    }
    table, p, h3 {
      empty-cells: inherit;
      font-family: Helvetica;
      font-size: small;
      width: 290px;
      padding-left: 0px;
      border-collapse: collapse;
    }
    table, tr, td {
      border-bottom: 0;
    }
    hr {
      border-top: 1px dashed black;
    }
    tr.bt {
      border-top: 1px dashed black;
      border-bottom: 0px;
    }
    tr {
      padding-top: -5px;
    }
  </style>`

  print(): void {
    let printContents, popupWin
    printContents = document.getElementById('demo').innerHTML
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto')
    popupWin.document.open()
    popupWin.document.write(`
    <html>
      <head>
        <title>Print tab</title>
        <style>
        @media print {
          app-root > * { display: none; }
          app-root app-print-layout { display: block; }
          .header{
            text-align: center;
          }
          th{
            text-align: left
        }
          body   { font-family: 'Courier New', Courier, monospace; width: 300px }
          br {
            display: block; /* makes it have a width */
            content: ""; /* clears default height */
            margin-top: 0; /* change this to whatever height you want it */
          }
          hr.print{
            display: block;
            height: 1px;
            background: transparent;
            width: 100%;
            border: none;
            border-top: dashed 1px #aaa;
        }
        tr.print
          {
            border-bottom: 1px solid #000;;
          }
        }
        </style>
      </head>
  <body onload="window.print();window.close()">${printContents}</body>
    </html>`)
    popupWin.document.close()
  }
  electronPrint() {
    this.printreceipt()
    console.log(this.order, this.Discount)
    var element = `<div class="header">
    <p style="text-align: center;font-family: Helvetica;font-size: medium;"><strong>${this.name
      }</strong></p>
    <p style="text-align: center;font-family: Helvetica;font-size: small;">
    ${this.address}, ${this.city},  ${this.phoneNo}<br>
    GSTIN:${localStorage.getItem('GSTno')}<br>
    Receipt: ${this.InvoiceNo}<br>
    ${this.OrderedDateTime}</p>
    <hr>
    </div>
    <table>
        <thead>
            <tr>
                <th style="width: 100px;"><strong>ITEM</strong></th>
                <th><strong>PRICE</strong></th>
                <th><strong>QTY</strong></th>
                <th style="text-align: right;padding-right:20px"><strong>AMOUNT</strong></th>
            </tr>
        </thead>
        <tbody>`
    var Subtotal = 0
    var disc_tax = 0
    this.order.Items.forEach(Items => {
      element =
        element +
        `<tr>
      <td style="width: 100px;">${Items.ProductName}</td>
      <td>${Items.Price}</td>
      <td>${Items.OrderQuantity}${Items.ComplementryQty > 0 ? '+' + Items.ComplementryQty : ''}</td>
      <td style="text-align: right;padding-right:20px">${this.preferences.ShowTaxonBill
          ? (Items.Price * Items.OrderQuantity).toFixed(2)
          : (
            Items.Price *
            Items.OrderQuantity *
            (1 + (Items.Tax1 + Items.Tax2 + Items.Tax3) / 100)
          ).toFixed(2)
        }</td>
      </tr>`
      if (!this.preferences.ShowTaxonBill) {
        Subtotal =
          Subtotal +
          Items.Price * Items.OrderQuantity * (1 + (Items.Tax1 + Items.Tax2 + Items.Tax3) / 100)
        disc_tax = disc_tax + (this.Discount * (Items.Tax1 + Items.Tax2 + Items.Tax3)) / 100
      }
    })
    element =
      element +
      `
    </tbody>
    </table>
    <hr>
    <table>
        <tbody>
            <tr>
                <td style="width: 100px;"><strong>Subtotal</strong></td>
                <td></td>
                <td></td>
                <td style="text-align: right;padding-right:20px">${this.preferences.ShowTaxonBill
        ? this.order.Subtotal.toFixed(2)
        : Subtotal.toFixed(2)
      }</td>
            </tr>`
    this.AdditionalCharges.forEach(item => {
      element =
        element +
        `<tr">
                                <td style="width: 100px;"><strong>${item.Description}</strong></td>
                                <td></td>
                                <td></td>
                                <td style="text-align: right;padding-right:20px">${item.ChargeAmount.toFixed(
          2,
        )}</td>
                            </tr>`
    })
    if (this.Discount > 0) {
      element =
        element +
        `<tr>
      <td style="width: 100px;"><strong>Discount</strong></td>
      <td></td>
      <td></td>
      <td style="text-align: right;padding-right:20px">${(this.Discount + disc_tax).toFixed(2)}</td>
      </tr>`
    }
    if (this.order.Tax1 > 0 && this.preferences.ShowTaxonBill) {
      element =
        element +
        `<tr>
      <td style="width: 100px;"><strong>CGST</strong></td>
      <td></td>
      <td></td>
      <td style="text-align: right;padding-right:20px">${this.order.Tax1.toFixed(2)}</td>
  </tr>`
    }
    if (this.order.Tax2 > 0 && this.preferences.ShowTaxonBill) {
      element =
        element +
        `<tr>
      <td style="width: 100px;"><strong>SGST</strong></td>
      <td></td>
      <td></td>
      <td style="text-align: right;padding-right:20px">${this.order.Tax2.toFixed(2)}</td>
  </tr>`
    }

    element =
      element +
      `
            <tr>
                <td style="width: 100px;">Paid</td>
                <td></td>
                <td></td>
                <td style="text-align: right;padding-right:20px"><strong>${(+this.order.PaidAmount.toFixed(
        0,
      )).toFixed(2)}</strong></td>
            </tr>
            <tr>
                <td style="width: 100px;">Total</td>
                <td></td>
                <td></td>
                <td style="text-align: right;padding-right:20px"><strong>${(+this.Total.toFixed(
        0,
      )).toFixed(2)}</strong></td>
            </tr>
            <tr ${+(this.Total - this.PaidAmount).toFixed(0) == 0 ? 'hidden' : ''}>
                <td style="width: 100px;">Balance</td>
                <td></td>
                <td></td>
                <td style="text-align: right;padding-right:20px"><strong>${(+(
        this.Total - this.PaidAmount
      ).toFixed(0)).toFixed(2)}</strong></td>
            </tr>
        </tbody>
    </table>
    <hr>
    <p style="text-align: center;font-family: Helvetica;">Thankyou. Visit again.</p>
</div>
<style>
  table{
    empty-cells: inherit;
    font-family: Helvetica;
    font-size: small;
    width: 290px;
    padding-left: 0px;
  }
  th{
    text-align: left
  }
  hr{
    border-top: 1px dashed black
  }
  tr.bordered {
    border-top: 100px solid #000;
    border-top-color: black;
  }
</style>`
  }
  printreceipt() {
    var printtemplate = `
    <div id="printelement">
    <div class="header">
    <h3>${this.loginfo.name}</h3>
    <p>
        ${this.loginfo.store}, ${this.loginfo.address}<br>
        ${this.loginfo.city}, ${this.loginfo.phoneNo}
        GSTIN:${this.loginfo.GSTno}<br>
        Receipt: ${this.order.InvoiceNo}<br>
        ${this.order.OrderedDateTime}
        </p>
    </div>
    <hr>
    <div ${this.order.CustomerDetails?.PhoneNo ? '' : 'hidden'} class="header">
        <h3 ${this.order.CustomerDetails?.Name ? '' : 'hidden'}>${this.order.CustomerDetails?.Name
      }</h3>
        <p>${this.order.CustomerDetails?.Address ? this.order.CustomerDetails?.Address + '<br>' : ''
      }${this.order.CustomerDetails?.City ? this.order.CustomerDetails?.City + ',' : ''}${this.order.CustomerDetails?.PhoneNo
      }</p>
    </div>
    <hr>
    <table class="item-table">
        <thead class="nb">
            <th class="text-left" style="width: 100px;">ITEM</th>
            <th>PRICE</th>
            <th>QTY</th>
            <th class="text-right">AMOUNT</th>
        </thead>
        <tr>
        <td colspan="4"><hr></td>
      </tr>
        <tbody>`
    var extra = 0
    this.order.Items.forEach(item => {
      printtemplate += `
      <tr class="nb">
          <td class="text-left">${item.ProductName}</td>
          <td>${item.Price}</td>
          <td>${item.OrderQuantity}${item.ComplementryQty > 0 ? '(' + item.ComplementryQty + ')' : ''
        }</td>
          <td class="text-right">${item.OrderQuantity > 0 ? item.TotalAmount.toFixed(2) : 0}</td>
      </tr>`
      extra += item.Extra
    })
    printtemplate += `
    <tr class="bt">
        <td class="text-left"><strong>Sub Total</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.order.Subtotal}</td>
    </tr>
    <tr class="nb" ${this.order.DiscAmount == 0 ? 'hidden' : ''}>
        <td class="text-left"><strong>Discount</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.order.DiscAmount.toFixed(2)}</td>
    </tr>
    <tr class="nb" ${this.order.Tax1 == 0 ? 'hidden' : ''}>
        <td class="text-left"><strong>CGST</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.order.Tax1.toFixed(2)}</td>
    </tr>
    <tr class="nb" ${this.order.Tax2 == 0 ? 'hidden' : ''}>
        <td class="text-left"><strong>SGST</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.order.Tax2.toFixed(2)}</td>
    </tr>`
    // this.AdditionalCharges.forEach(charge => {
    //   printtemplate += `
    //       <tr class="nb">
    //           <td class="text-left"><strong>${charge.Description}</strong></td>
    //           <td colspan="2"></td>
    //           <td class="text-right">${charge.ChargeAmount.toFixed(2)}</td>
    //       </tr>`
    // })
    printtemplate += `
          <tr class="nb" ${extra > 0 ? '' : 'hidden'}>
              <td class="text-left"><strong>Extra</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${(+extra.toFixed(0)).toFixed(2)}</td>
          </tr>
          <tr class="nb">
              <td class="text-left"><strong>Paid</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${(+this.order.PaidAmount.toFixed(0)).toFixed(2)}</td>
          </tr>
          <tr class="nb">
              <td class="text-left"><strong>Total</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${(+this.order.BillAmount.toFixed(0)).toFixed(2)}</td>
          </tr>
          <tr class="nb" ${this.order.BillAmount - this.order.PaidAmount > 0 ? '' : 'hidden'}>
              <td class="text-left"><strong>Balance</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${(+(this.order.BillAmount - this.order.PaidAmount).toFixed(
      0,
    )).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <hr>
      <div class="text-center">
        <p>Powered By BizDom.</p>
      </div>
    </div>`

    printtemplate += this.printhtmlstyle
    console.log(printtemplate)
    if (this.printersettings)
      this.printservice.print(printtemplate, [this.printersettings.receiptprinter])
  }
}
