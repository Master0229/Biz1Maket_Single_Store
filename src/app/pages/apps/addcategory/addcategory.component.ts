import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Location } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.scss']
})
export class AddcategoryComponent implements OnInit {
  pcategories: any = [];
  category: any = { id: 0, parentCategoryId: null, description: '', isactive: true, sortOrder: -1, companyId: 1, variantgroupids: [] };
  catid = 0;
  variantgroups:any = [];
  variantgroupids:any = [];
  size = 'default';
  submitted: boolean = false;
  constructor(private Auth: AuthService, public location: Location, private notification: NzNotificationService, private _avRoute: ActivatedRoute) {
    this.catid = +this._avRoute.snapshot.params["id"];
    if (this.catid != 0) {
      this.getcategorybyid();
    }
  }

  ngOnInit(): void {
    this.getpcategories();
    this.getvariantgroups(); 
  }
  getpcategories() {
    this.Auth.getcategories(1, 'P').subscribe(data => {
      this.pcategories = data;
      console.log(this.pcategories)
    })

  }
  getcategorybyid() {
    this.Auth.getcategorybyid(this.catid).subscribe(data => {
      console.log(data);
      this.category = data;
      console.log(this.category)
    })
  }
  getvariantgroups() {
    this.Auth.getvariantgroups_l(1).subscribe(data => {
      this.variantgroups = data;
      console.log(this.variantgroups)
    })
  }
  
  validation() {
    var isvalid = true;
    if (this.category.description == '') isvalid = false;
    return isvalid;
  }

  save() {
    console.log(this.category.variantgroupids)
    // return
    if (this.category.id > 0) this.updateCategory();
    else this.addCategory();
  }
  addCategory() {
    this.submitted = true;
    if (this.validation()) {
      this.Auth.addcategories(this.category).subscribe(data => {
        this.notification.success("Category Added", "Category Added Successfully")
        this.location.back()
        console.log(data);
      })
    }else{
      this.notification.error("Error", "Category Added UnSuccessfully")
    }
  }
  updateCategory() {
    this.submitted = true;
    if (this.validation()) {
      this.Auth.updatecategory(this.category).subscribe(data => {
        this.notification.success("Category Updated", "Category Updated Successfully")
        this.location.back()
        console.log(data);
      })
    }else{
      this.notification.error("Error", "Category Added UnSuccessfully")
    }

  }
 
}
