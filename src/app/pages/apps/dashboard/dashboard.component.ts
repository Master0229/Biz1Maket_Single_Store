import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'angular2-chartjs'
import { AuthService } from 'src/app/auth.service';
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import * as moment from 'moment'

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
  constructor(private Auth: AuthService,) {
    this.user = JSON.parse(localStorage.getItem("user"))
  }
  loginfo
  CompanyId: any
  StoreId: any
  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'orderkeydb']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
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


}
