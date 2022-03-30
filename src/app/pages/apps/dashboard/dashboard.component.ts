import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'angular2-chartjs'
import { AuthService } from 'src/app/auth.service';
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import * as moment from 'moment'
import { PrintService } from 'src/app/services/print/print.service'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(ChartComponent) chart: ChartComponent
  @ViewChild('tooltip') tooltip
  @ViewChild('legend') legend
  companyId: number = 0
  storeId: number = 0
  fromDate: string = moment().subtract(7, "days").format("YYYY-MM-DD")
  toDate: string = moment().format("YYYY-MM-DD")
  toDay: string = moment().format("YYYY-MM-DD")
  showData: boolean = false
  toDaySales: any
  totalCustomers: number = 0
  oldCustomer: number = 0
  newcustomer: number = 0

  chartData = {
    "labels": ["New Customer", "Old Customer"],
    "datasets": [
      {
        "data": [0, 10],
        "backgroundColor": ["#46be8a", "#1b55e3"],
        "borderColor": "#fff",
        "borderWidth": 2,
        "hoverBorderWidth": 0,
        "borderAlign": "inner"
      }
    ]
  }


  options = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 70,
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
      custom: tooltipData => {
        const tooltipEl = this.tooltip.nativeElement
        tooltipEl.style.opacity = 1
        if (tooltipData.opacity === 0) {
          tooltipEl.style.opacity = 0
        }
      },
      callbacks: {
        label: (tooltipItem, itemData) => {
          const dataset = itemData.datasets[0]
          const value = dataset.data[tooltipItem.index]
          this.tooltip.nativeElement.innerHTML = value
        },
      },
    },
    legendCallback: chart => {
      const { labels } = chart.data
      const legendMarkup = []
      const dataset = chart.data.datasets[0]
      legendMarkup.push('<div class="flex-shrink-0">')
      let legends = labels.map((label, index) => {
        const color = dataset.backgroundColor[index]
        return `<div class="d-flex align-items-center flex-nowrap mt-2 mb-2">
                  <div class="tablet mr-3" style="background-color: ${color}"></div>
                  ${label}
                  </div>`
      })
      legends = legends.join('')
      legendMarkup.push(legends)
      legendMarkup.push('</div>')
      this.legend.nativeElement.innerHTML = legendMarkup.join('')
    },
  }

  barchartData = {
    "labels": [],
    "series": [
      {
        "className": "ct-series-b",
        "data": []
      }
    ]
  }


  chartOptions = {
    stackBars: true,
    fullWidth: true,
    chartPadding: {
      right: 0,
      left: 0,
      top: 5,
      bottom: 0,
    },
    low: 0,
    axisY: {
      showGrid: false,
      showLabel: false,
      offset: 0,
    },
    axisX: {
      showGrid: false,
      showLabel: true,
      offset: 20,
    },
    seriesBarDistance: 5,
    plugins: [
      ChartistTooltip({
        anchorToPoint: false,
        appendToBody: true,
        seriesName: false,
      }),
    ],
  }
  user: any
  constructor(private Auth: AuthService, private printservice: PrintService) {
    this.user = JSON.parse(localStorage.getItem("user"))
  }
  loginfo
  CompanyId: any
  StoreId: any
  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'orderkeydb', 'printersettings']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.printersettings = data['printersettings'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      this.getData()
    })

  }

  ngAfterViewChecked() {
    // console.log(this.chart)
    if (this.showData)
      this.chart.chart.generateLegend()
  }
  prodwisesales = []
  getDashBoard() {
    this.Auth.getDashboard(this.storeId, this.companyId, this.fromDate, this.toDate, this.toDay).subscribe(data => {
      console.log(data);
      this.chartData.datasets[0].data[0] = data["customerData"][0]["newCustomers"]
      this.chartData.datasets[0].data[1] = data["customerData"][0]["oldCustomers"]

      this.totalCustomers = data["customerData"][0]["newCustomers"] + data["customerData"][0]["oldCustomers"]

      data["daySales"].forEach(sale => {
        this.barchartData.labels.push(moment(sale.theDate).format("DD/MM"))
        this.barchartData.series[0].data.push(sale.sales)
      });

      this.toDaySales = data["todaySales"][0]

      this.newcustomer = data["customerData"][0]["newCustomers"]
      this.oldCustomer = data["customerData"][0]["oldCustomers"]

      this.prodwisesales = data["prodsalesreport"]
      this.showData = true
    })
  }

  getData() {
    this.Auth.getloginfo().subscribe(data => {
      this.companyId = data["companyId"]
      this.storeId = data["storeId"]
      this.getDashBoard()
      this.stores()
      this.accounts()
    })
  }
  store: any
  stores() {
    this.Auth.getstores(this.loginfo.companyId).subscribe(data => {
      this.store = data["storeList"]
      this.store = this.store.filter(x => x.id == this.storeId)
      console.log(this.store);
    })
  }
  account: any
  accounts() {
    this.Auth.getusers(this.loginfo.storeId, this.loginfo.companyId).subscribe(data => {
      this.account = data
      this.account = this.account.filter(x => x.id == this.storeId)
      console.log(this.account, this.storeId);

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
    <strong style="margin-left:50px;font-size:18px";>DayWise Report</strong>
    <p> Date : 28-03-2022<p/>
    <hr>
   <div>
   <h2 style="font-size:15px">Today Sale    : 123454<h2/>
   <h2 style="font-size:15px">Today Payment : 123454<h2/>
   <h2 style="font-size:15px">Today Order   : 123454<h2/>
   <h2 style="font-size:15px">Old Customer  : 123454<h2/>
   <h2 style="font-size:15px">New Customer  : 123454<h2/>
   <div/>`

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
    const week_days = ["SUnday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var printtemplate = `
    <div id="printelement">
    <strong style="margin-left:50px;font-size:18px";>DayWise Report</strong>
    <p> Date :${moment().format('YYYY-MM-DD')}  : Day : ${week_days[moment().day()]}  <p/>
    <hr>
   <div>
   <h2 style="font-size:15px">Total Sale    : ${this.toDaySales.sales} <h2/>
   <h2 style="font-size:15px">Total Payment : ${this.toDaySales.payments} <h2/>
   <h2 style="font-size:15px">Total Order   : ${this.toDaySales.bills} <h2/>
   <h2 style="font-size:15px">Old customer  :  ${this.newcustomer}<h2/>
   <h2 style="font-size:15px">New customer  : ${this.oldCustomer}<h2/>
   <div/>
    <hr>
    <div>
    <strong style="margin-left:10px;font-size:14px">Powered By BizDom.</strong>
    </div>`


    printtemplate += this.printhtmlstyle
    console.log(printtemplate)
    if (this.printersettings)
      this.printservice.print(printtemplate, [this.printersettings.receiptprinter])
  }


}
