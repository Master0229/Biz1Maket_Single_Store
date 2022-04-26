import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'
import * as moment from 'moment'

@Component({
  selector: 'app-catawise-sale',
  templateUrl: './catawise-sale.component.html',
  styleUrls: ['./catawise-sale.component.scss']
})
export class CatawiseSaleComponent implements OnInit {

  constructor(private Auth: AuthService,) { }
  date: { year: number; month: number }
  dateRange = []
  loginfo
  CompanyId: number
  StoreId: number
  strdate: string
  enddate: string

  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
    })
    this.strdate = moment().format('YYYY-MM-DD')
    this.enddate = moment().format('YYYY-MM-DD')
    this.GetCataWiseRpt()
  }

  getcategory : any
  GetCataWiseRpt(){
    this.Auth.GetCataRpt(this.strdate, this.enddate, this.StoreId, this.CompanyId).subscribe(data => {
      this.getcategory = data["order"]
      console.log(this.getcategory)
    })
  }

  onChange(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')
    this.GetCataWiseRpt()

  }

}
