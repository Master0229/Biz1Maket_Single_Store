import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core'
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service'
import { NzNotificationService } from 'ng-zorro-antd'
import { merge, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators'
import { PrintService } from 'src/app/services/print/print.service'
import { SyncService } from 'src/app/services/sync/sync.service'

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  model: any = 'QWERTY'
  inputValue: string = ''
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  focus$ = new Subject<string>()
  click$ = new Subject<string>()


  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any> //productinput
  @ViewChild('discper', { static: false }) public discperel: TemplateRef<any>
  @ViewChild('disc', { static: false }) public discel: TemplateRef<any>
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef



  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private printservice: PrintService,
    private sync: SyncService,
  ) { }

  prod: any
  term: ''
  products: any
  item: any
  loginfo
  strdate: string = null
  enddate: string = null
  CompanyId: any
  StoreId: any
  date: { year: number; month: number }
  dateRange = []
  daterangemonth = []




  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'printersettings']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.printersettings = data['printersettings'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      this.sync.sync()
      this.getproducts()
    })
  }

  onChange(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')
    this.getproducts()
  }


  getproducts() {
    this.Auth.getstockbatch(this.strdate, this.enddate, this.loginfo.storeId, this.loginfo.companyId).subscribe(data => {
      this.products = data
      this.prod = this.products
      console.log(this.products)
    })
  }


  saveBatch() {
    console.log(this.products.filter(x => x.stockQty != x.quantity))
    this.Auth.Updatestockbatch(this.products.filter(x => x.stockQty != x.quantity)).subscribe(data1 => {
      console.log(data1)
      this.sync.sync()
      this.Auth.updatestockbatchdb(data1['stockBatch']).subscribe(data => {
        this.getproducts()
        this.notification.success("Stock Added", "Stock Added Successfully")
      })
    })
  }


  showInactive: Boolean = false
  changefilter(bool) {
    this.showInactive = bool
    console.log(bool)
    if (bool) {
      this.prod = this.products.filter(x => x.quantity < 6)
    } else {
      this.prod = this.products.filter(x => x.quantity)

    }
    console.log(this.prod.length)
  }

  filteredvalues = [];
  filtersearch(): void {
    this.prod = this.term
      ? this.prod.filter(x => x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.prod;
    console.log(this.prod)
  }


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
    var element = `<div class="header">
    <hr>
    </div>
    <table>
        <thead>
            <tr>
                <th style="width: 100px;"><strong>Products</strong></th>
                <th style="width: 100px;"><strong>Quantity</strong></th>

            </tr>
        </thead>
        <tbody>`
    this.products.filter(x => x.quantity < 6).forEach(item => {
      element =
        element +
        `<tr>
      <td style="width: 100px;">${item.product}</td>
      <td class="text-left" style="padding:5px">${item.quantity}</td>

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
    <strong style="margin-left:50px;font-size:18px";>Purchase List</strong>
    <hr>
    <table class="item-table">
        <thead class="nb">
        <th class="text-left" style="width:50px;">S.No</th>
        <th class="text-left" >Products</th>
        <th class="text-left" >Quantity</th>
        </thead>
        <tr>
      </tr>
        <tbody>`
    this.products.filter(x => x.quantity < 6).forEach(item => {
      printtemplate += `
      <tr class="nb">
      <td>.</td>
          <td class="text-left" style="padding:5px">${item.product}</td>
          <td class="text-left" >${item.quantity}</td>
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


