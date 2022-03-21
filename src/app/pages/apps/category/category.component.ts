import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Location } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  CompanyId: any;
  StoreId: any;
  categories: any = [];
  categoryact: any = []
  term: string = '';
  show = true;
  pcategories: any = [];
  categorys: any
  category: any = { id: 0, parentCategoryId: null, description: '', isactive: true, sortOrder: -1, companyId: 1, variantgroupids: [] };
  catid = 0;
  variantgroups: any = [];
  variantgroupids: any = [];
  size = 'default';
  submitted: boolean = false;
  units: any;
  kotgroups: any;
  isvisible: boolean;
  visible = false;
  checked: Boolean = true
  taxgroups: any;
  id: any
  catactive: any;
  mapOfSort: { [key: string]: any } = {
    id: null,
    name: null,
    description: null,
    category: null,
    tax: null,
    price: null,
    quantity: null,
    status: null,
  }
  sortName: string | null = null
  sortValue: string | null = null
  loginfo: any;
  cat: any
  categoryid: any = [];
  companyid: number;
  Category: any;

  constructor(private Auth: AuthService, public location: Location, private notification: NzNotificationService, private _avRoute: ActivatedRoute) {
    this.catid = +this._avRoute.snapshot.params["id"];
    // if (this.catid != 0) {
    //   this.getcategorybyid();
    // }
  }

  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'printersettings', 'orderkeydb']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.CompanyId
      this.StoreId = this.loginfo.StoreId
      this.getCategory();
      this.getpcategories();
      this.getvariantgroups();
      this.getcatactive()
      })
  }

  getCategory() {
    this.Auth.getcategories(this.loginfo.companyId, 'A').subscribe(data => {
      this.categories = data;
      // this.cat = this.categories.filter(x => x.isactive)
      console.log(this.categories)
      this.show = true
    })
  }

  filteredvalues = [];
  filtersearch(): void {
    this.Category = this.term
      ? this.categoryact.filter(x => x.description.toLowerCase().includes(this.term.toLowerCase()))
      : this.categoryact;
    console.log(this.Category)
  }

  getpcategories() {
    this.Auth.getcategories(this.loginfo.companyId, 'P').subscribe(data => {
      this.pcategories = data;
      console.log(this.pcategories)
    })
  }
  getcategorybyid(id) {
    this.Auth.getcategorybyid(id).subscribe(data => {
      this.category = data;
      console.log(this.category)
      this.show = !this.show;
    })
  }
  back() {
    this.show = !this.show;
    this.category = { id: 0, parentCategoryId: null, description: '', isactive: true, sortOrder: -1, companyId: 1, variantgroupids: [] };
  }

  validation() {
    var isvalid = true;
    if (this.category.description == '') isvalid = false;
    return isvalid;
  }

  save() {
    console.log(this.category.variantgroupids)
    if (this.category.id > 0) this.addcategory();
    else this.addcategory();
  }

  //  Add Category

  addcategory() {
    this.category.companyId = this.loginfo.companyId
    if (this.category.id == 0) {
      this.Auth.addcategories(this.category).subscribe(data => {
        this.back()
        console.log(data);
        this.show = !this.show
        this.getcatactive();
      })
    } else if (this.category.id > 0) {
      this.Auth.updatecategory(this.category).subscribe(data1 => {
        console.log(data1)
        this.show = !this.show
        this.getcatactive();
      })
    }
  }
  updateCategory() {
    this.submitted = true;
    if (this.validation()) {
      this.Auth.updatecategory(this.category).subscribe(data => {
        this.notification.success("Category Updated", "Category Updated Successfully")
        this.back()
        console.log(data);
      })
    } else {
      this.notification.error("Error", "Category Added UnSuccessfully")
    }
  }
  open(): void {
    this.visible = true
  }

  close(): void {
    this.visible = false
  }
  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.target.files[0];
    console.log(this.file);
  }
  sort(sortName: string, value: string): void {
    this.sortName = sortName
    this.sortValue = value
    for (const key in this.mapOfSort) {
      if (this.mapOfSort.hasOwnProperty(key)) {
        this.mapOfSort[key] = key === sortName ? value : null
      }
    }
  }

  gettax() {
    this.Auth.getTax(this.loginfo.companyId).subscribe(data => {
      this.taxgroups = data;
      console.log(this.taxgroups);

    });
  }
  getUnits() {
    this.Auth.getUnits().subscribe(data => {
      this.units = data;
      console.log(data);

    })
  }
  getKotGroups() {
    this.Auth.getKotgroups().subscribe(data => {
      this.kotgroups = data;
      console.log(data);
    })
  }
  getvariantgroups() {
    this.Auth.getvariantgroups_l(1).subscribe(data => {
      this.variantgroups = data;
      console.log(this.variantgroups)
    })
  }

  // Active in active

  getcatactive() {
    this.Auth.catactive(this.loginfo.companyId).subscribe(data => {
      this.categoryact = data
      this.Category = this.categoryact.filter(x => x.isactive == !this.showInactive)
      console.log(this.categoryact);
      this.show = true
    })
  }

  active(id, act) {
    console.log(id, act)
    this.Auth.Categoryupdate(id, act, this.loginfo.companyId).subscribe(data => {
      console.log(data)
      this.getcatactive()
    });
  }
  showInactive: Boolean = false
  changefilter(bool) {
    this.showInactive = bool
    console.log(bool)
    if (bool) {
      this.Category = this.categoryact.filter(x => !x.isactive);
    } else {
      this.Category = this.categoryact.filter(x => x.isactive);
    }
    console.log(this.categoryact.length)
  }

}

