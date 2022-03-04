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
  vendorsitem: any = [];
  show = true;
  term: string = '';
  vendors: any = { id: 0, name: "", phoneNo: "", address: "", city: "", postalCode: null, email: '', companyId: 1 }
  vendorid = 0;
  constructor(private Auth: AuthService, public location: Location, private _avRoute: ActivatedRoute) {
    this.vendorid = +this._avRoute.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.getVendorList();
    // if (this.vendorid > 0) {
    //   this.getvendorbyid();
    // }
  }
  getVendorList() {
    this.Auth.getvendors(1).subscribe(data => {
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
    // this.submitted = false;
    // this.variant = { id: 0, name: "", description: "", price: 0, sortOrder: -1, variantGroupId: 0, companyId: 1, action: "", count: "", variantGroup: null }
    // this.variantgroup = { id: 0, name: "", description: "", sortOrder: -1, companyId: 1, action: "" }
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
