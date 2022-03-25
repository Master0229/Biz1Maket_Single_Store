import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  loginfo: any
  CompanyId: number
  StoreId: number
  vendorsitem: any = [];
  show = true;
  term: string = '';
  vendors: any = { id: 0, name: "", phoneNo: "", address: "", city: "", postalCode: null, email: '', companyId: 1 }
  vendorid = 0;
  constructor(private Auth: AuthService, public location: Location, private _avRoute: ActivatedRoute) {
    this.vendorid = +this._avRoute.snapshot.params["id"];
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
    })
    this.getVendorList();
  }
  getVendorList() {
    this.Auth.getvendors(this.CompanyId).subscribe(data => {
      this.vendorsitem = data;
      console.log(this.vendorsitem)
      this.filteredvalues = this.vendorsitem;
      this.show = true
    })
  }
  addVendor() {
    if(this.vendors.id == 0) {
      this.Auth.addvendors(this.vendors).subscribe(data => {
        // console.log(data)
        this.show = !this.show
        this.getVendorList();
      })
    }else if(this.vendors.id > 0) {
      this.Auth.updatevendors(this.vendors).subscribe(data1 => {
        console.log(data1)
        this.show = !this.show
        this.getVendorList();
      })
    }
  }
  getvendorbyid(id) {
    this.Auth.getVendorListbyid(id).subscribe(data => {
      // console.log(data)
      this.vendors = data
      this.show = !this.show;
    })
  }
  back() {
    this.show = !this.show;
    this.vendors = { id: 0, name: "", phoneNo: "", address: "", city: "", postalCode: null, email: '', companyId: 1 }
  }
  filteredvalues:any = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.vendorsitem.filter(x => x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.vendorsitem;
    // console.log(this.filteredvalues)
  }


}
