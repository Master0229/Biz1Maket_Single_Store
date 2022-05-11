import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'
import * as moment from 'moment'


@Component({
  selector: 'app-daywise-sale',
  templateUrl: './daywise-sale.component.html',
  styleUrls: ['./daywise-sale.component.scss']
})
export class DaywiseSaleComponent implements OnInit {

  constructor(private Auth: AuthService,) { }

  daysales: any
  strdate: string
  enddate: string
  CompanyId: any
  StoreId: any
  dateRange = []
  daterangemonth = []
  loginfo
  date: { year: number; month: number }
  sourceid: any
  TotalSales = 0;
  TotalPayments = 0;
  errorMsg: string = '';
  status: number;
  monthrpt: any


  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
    })

    this.strdate = moment().format('YYYY-MM-DD')
    this.enddate = moment().format('YYYY-MM-DD')
    this.daywisesale()
    this.getmonthwise()
  }

  daywisesale() {
    this.Auth.daywise(this.strdate, this.enddate, this.StoreId, this.CompanyId, 0).subscribe(data => {
      this.daysales = data["order"]
      console.log(this.daysales)
      this.TotalPayments = 0;
      this.TotalSales = 0;
      if (this.daysales)
        this.daysales.forEach(ds => {
          ds.OrderedDate = moment(ds.orderedDate).format('ll');
          this.TotalPayments = this.TotalPayments + ds.totalPayments;
          this.TotalSales = this.TotalSales + ds.totalSales;
        });
      // for (let i = 0; i < this.daysales.length; i++) {
      //   this.daysales[i].OrderedDate = moment(this.daysales[i].orderedDate).format('ll');
      //   this.TotalPayments = this.TotalPayments + this.daysales[i].totalPayments;
      //   this.TotalSales = this.TotalSales + this.daysales[i].totalSales;
      // }
      this.TotalSales = +(this.TotalSales.toFixed(2))
      this.TotalPayments = +(this.TotalPayments.toFixed(2))
      var response: any = data
      if (response.status == 0) {
        this.status = 0;
        this.errorMsg = response.msg;

      }
    })
  }
  onChange(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')
    this.daywisesale()


  }
  onChangemonth(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')

    this.getmonthwise()

  }

  getmonthwise() {
    this.Auth.GetMonthRpt(this.strdate, this.enddate, this.StoreId, this.CompanyId).subscribe(data => {
      this.monthrpt = data["order"]
      console.log(this.monthrpt)
    })
  }

}
