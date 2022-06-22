import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'
import * as moment from 'moment'
import { PrintService } from 'src/app/services/print/print.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'



@Component({
  selector: 'app-paymenttypes',
  templateUrl: './paymenttypes.component.html',
  styleUrls: ['./paymenttypes.component.scss']
})
export class PaymenttypesComponent implements OnInit {

  constructor(private Auth: AuthService, private printservice: PrintService, private modalService: NgbModal,) { }
  trans: any
  strdate: string
  enddate: string
  CompanyId: any
  StoreId: any
  loginfo
  date: { year: number; month: number }
  dateRange = []
  storepayment: any = null;
  transaction: any = [];
  transpayment: any = [];
  paymenttype: any = [];



  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'printersettings']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.printersettings = data['printersettings'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
      this.strdate = moment().format('YYYY-MM-DD')
      this.enddate = moment().format('YYYY-MM-DD')
      this.gettransrpt()
    })


  }

  isVisible = false;
  isConfirmLoading = false;

  showModal2(transaction): void {
    this.isVisible = true;
    this.transaction = transaction
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  gettransrpt() {
    this.Auth.GetTrans(this.strdate, this.enddate, this.loginfo.storeId, this.loginfo.companyId).subscribe(data => {
      this.trans = data
      this.storepayment = data['transactions'];
      this.transpayment = [];

      console.log(this.storepayment)

    })
  }
  transp: any

  gettranstype(sourceid, ptypeid, transaction) {
    this.transaction = transaction
    console.log(sourceid, ptypeid, transaction)
    this.Auth.GetTransType(this.strdate, this.enddate, this.loginfo.storeId, this.loginfo.companyId, ptypeid, sourceid).subscribe(data => {
      this.transpayment = data['transactions'];
      this.transp = this.transpayment
      this.paymenttype = data["paymenttypes"]
      console.log(this.paymenttype)
      console.log(this.transaction);
      console.log(this.transpayment)

    })
  }

  term: string = '';
  filteredvalues = [];
  filtersearch(): void {
    this.transp = this.term
      ? this.transpayment.filter(x => x.invoiceNo.toLowerCase().includes(this.term.toLowerCase()))
      : this.transpayment;
    console.log(this.transpayment)
  }

  updatetransaction() {
    this.Auth.savetransaction(this.transaction).subscribe(data => {
      this.gettransrpt();
      this.isVisible = false;
    })
    
  }

  onChange(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')
    this.gettransrpt()

  }

  print(): void {
    let printContents, popupWin
    printContents = document.getElementById('demo').innerHTML
    popupWin = window.open('', '_blank', 'top=0,left=0,height=150%,width=auto')
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
    var element = `<div class="header">
    <hr>
    </div>
    <table>
        <thead>
            <tr>
                <th style="width: 100px;"><strong>Type</strong></th>
                <th style="width: 100px;"><strong>BillCount</strong></th>
                <th style="width: 100px;"><strong>Amount</strong></th>


            </tr>
        </thead>
        <tbody>`
    this.storepayment.forEach(item => {
      element =
        element +
        `<tr>
      <td style="width: 100px;">${item.paymentType}</td>
      <td style="width: 100px;">${item.billCount}</td>
      <td class="text-left" style="padding:5px">${item.amount}</td>

      </tr>`
    })
    element =
      element +
      `
        </tbody>
    </table>
    <hr>
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

  printersettings = { receiptprinter: '' }
  printhtmlstyle = `
  <style>
  body
  {
    counter-reset: Serial;           /* Set the Serial counter to 0 */
   }
    #printelement {
      width: 200px;
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


    tr td:first-child:before
    {
    counter-increment: Serial;
   content: " " counter(Serial);
   }
  </style>`

  printreceipt() {


    // console.log(this.item.product,this.products);

    var printtemplate = `
    <div id="printelement">
    <strong style="margin-left:50px;font-size:18px";>PaymentType List</strong>
    <hr>
    <table class="item-table">
        <thead class="nb">
        <th class="text-left" style="width:50px;">S.No</th>
        <th class="text-left" >PaymentType</th>
        <th class="text-left" >BillCount</th>
        <th class="text-left" >Amount</th>
        </thead>
        <tr>
      </tr>
        <tbody>`
    this.storepayment.forEach(item => {
      printtemplate += `
      <tr class="nb">
      <td>.</td>
          <td class="text-left" style="padding:5px">${item.paymentType}</td>
          <td class="text-left" >${item.billCount}</td>
          <td class="text-left" >${item.amount}</td>
      </tr>`
    })
    printtemplate += `
    </tbody>
    </table>
    <hr>
    <div>
    <strong style="margin-left:50px">Powered By BizDom.</strong>

    </div>
  </div>`
    printtemplate += this.printhtmlstyle
    console.log(printtemplate)
    if (this.printersettings)
      this.printservice.print(printtemplate, [this.printersettings.receiptprinter])
  }


}
