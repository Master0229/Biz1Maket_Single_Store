import { Component, OnInit } from '@angular/core'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service'
import * as moment from 'moment'

// const orders: any = require('./data.json')

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  closeResult: string

  // OLD Data
  Customer: any
  CompanyId: number
  status: number
  errorMsg: any
  show: any = false
  StoreId: number
  term
  masterdata = []
  p
  filteredcustomer = null
  deleteId
  loginfo
  constructor(private Auth: AuthService, private modalService: NgbModal) {
    // this.CompanyId = 1
    // this.StoreId = 26
  }

  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
    })

    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data

      this.getCustomer()
    })
  }

  getCustomer() {
    this.Auth.GetCustomer(this.loginfo.companyId, this.loginfo.storeId).subscribe(data => {
      this.Customer = data
      console.log(this.Customer)
      for (let i = 0; i < this.Customer.length; i++) {
        this.Customer[i].LastSeen = moment(this.Customer[i].LastSeen).format('LLL')
      }
      this.masterdata = this.Customer
    })
  }

  setcustomerdetail(id) {
    this.filteredcustomer = Object.assign({}, this.Customer.filter(x => x.id == id)[0])
  }

  savecustomer(Input) {
    this.filteredcustomer.ModifiedDate = moment()
    var data = { data: JSON.stringify(this.filteredcustomer) }
    this.Auth.UpdateCustomer(this.filteredcustomer).subscribe(data => {
      var response: any = data
      if (response.status == 0) {
        this.getCustomer()
      } else {
        this.getCustomer()
      }
    })
  }

  getcusdelete(Id) {
    this.Auth.Deletecustomer(Id).subscribe(data => {
      var response: any = data
      if (response.status == 0) {
        this.status = 0
        this.errorMsg = response.msg
        // dangertoast(this.errorMsg)
      } else {
        this.getCustomer()
        this.show = false
      }
    })
  }

  // POP Up
  openCustomClass(content) {
    this.modalService.open(content, { centered: true })
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
    console.log(this.term, this.masterdata)
    if (this.term == '' || this.term == null) {
      this.Customer = this.masterdata
    } else {
      this.Customer = this.masterdata.filter(
        x =>
          x.name?.toLowerCase().includes(this.term.toLowerCase()) ||
          x.phoneNo?.toLowerCase().includes(this.term.toLowerCase()),
      )
      // console.log(this.masterdata[0])
      // console.log(this.masterdata[0].Name.toLowerCase())
    }
  }
}
