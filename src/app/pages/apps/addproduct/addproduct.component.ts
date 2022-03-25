import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { AuthService } from 'src/app/auth.service'
import { NzNotificationService } from 'ng-zorro-antd'
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { PrintService } from 'src/app/services/print/print.service'
import * as moment from 'moment'


@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss'],
})
export class AddproductComponent implements OnInit {
  @ViewChild('barcodeel', { static: false }) public barcodeel: TemplateRef<any>;//productinput

  constructor(
    private Auth: AuthService,
    public location: Location,
    private notification: NzNotificationService,
    private _avRoute: ActivatedRoute,
    private printservice: PrintService,
  ) {

  }
  https = 0
  loginfo
  CompanyId: any

  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'printersettings']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.printersettings = data['printersettings'][0]
      this.CompanyId = this.loginfo.companyId
      this.getprod()
    })
  }

  prod: any
  prods: any
  product = {
    Name: '',
    Createddate: moment().format('YYYY-MM-DD HH:mm A'),
    CompanyId: 0
  }

  addprod() {
    this.product.CompanyId = this.loginfo.companyId
    this.Auth.getneededproduct(this.product).subscribe(data => {
      this.prod = data["needProducts"]
      console.log(data)
      // this.barcodeel['nativeElement'].focus()
      this.barcodeel['nativeElement'].value = ' ';
      this.getprod()
      console.log(this.barcodeel);
    })
  }

  getprod() {
    this.Auth.GetNeededProd(this.loginfo.companyId).subscribe(data => {
      this.prods = data
      console.log(this.prods)
    })
  }
  // 25-03-2022
  getprodlist: any
  deleteitem(Id) {
    console.log('delete', Id)
    this.Auth.deleteproduct({ id: Id, CompanyId: this.loginfo.companyId }).subscribe(data => {
      this.getprodlist = data
      this.getprod()
    })
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
            </tr>
        </thead>
        <tbody>`
    this.prods.forEach(item => {
      element =
        element +
        `<tr>
      <td style="width: 100px;">${item.name}</td>
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
    <strong style="margin-left:50px;font-size:18px";>Needed Product</strong>
    <hr>
    <table class="item-table">
        <thead class="nb">
        <th class="text-left" style="width:50px;">S.No</th>
        <th class="text-left" >Products</th>
        </thead>
        <tr>
      </tr>
        <tbody>`
    this.prods.forEach(item => {
      printtemplate += `
      <tr class="nb">
      <td>.</td>
          <td class="text-left" style="padding:5px">${item.name}</td>
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
