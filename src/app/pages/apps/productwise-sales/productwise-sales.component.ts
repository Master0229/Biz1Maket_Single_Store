import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'
import * as moment from 'moment'



@Component({
  selector: 'app-productwise-sales',
  templateUrl: './productwise-sales.component.html',
  styleUrls: ['./productwise-sales.component.scss']
})
export class ProductwiseSalesComponent implements OnInit {

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
    this.getprodwise()
  }

  ProdWise:any
  percent = 0;
  TotalSale = 0

  getprodwise(){
    this.TotalSale = 0
    this.Auth.GetProdRpt(this.strdate, this.enddate, this.StoreId, this.CompanyId).subscribe(data=>{
      this.ProdWise = data["order"]
      console.log(this.ProdWise)

      this.ProdWise.forEach(row => {
        this.TotalSale += row["totalAmount"]
      });


    })
  }



  onChange(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')
    this.getprodwise()

  }


}
