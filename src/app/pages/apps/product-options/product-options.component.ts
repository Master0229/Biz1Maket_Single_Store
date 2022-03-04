import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { NzNotificationService } from 'ng-zorro-antd'


@Component({
  selector: 'app-product-options',
  templateUrl: './product-options.component.html',
  styleUrls: ['./product-options.component.scss']
})
export class ProductOptionsComponent implements OnInit {
  buttonname = 'Add Variant';
  currenttab = 'variant'
  show = true;
  CompanyId: number;
  variant: any = { id: 0, name: "", description: "", price: 0, sortOrder: -1, variantGroupId: 0, companyId: 1, action: "", count: "", variantGroup: null }
  variantgroup: any = { id: 0, name: "", description: "", sortOrder: -1, companyId: 1, action: "" }
  variants: any = [];
  variantgroups: any = [];
  isAllDisplayDataChecked = false
  isOperating = false
  isIndeterminate = false
  mapOfCheckedId: { [key: string]: boolean } = {}
  numberOfChecked = 0;
  datasavetype: string = "1";
  constructor(private Auth: AuthService, private notification: NzNotificationService) {
    this.datasavetype = localStorage.getItem("datasavetype");
  }

  ngOnInit(): void {
    this.getvariantgroups();
  }

  ontabchange(e) {
    console.log(e);
    if (e.nextId == 'ngb-tab-0') {
      this.buttonname = '+Add Variant';
      this.currenttab = 'variant'
    }
    if (e.nextId == 'ngb-tab-1') {
      this.buttonname = '+Add VariantGroup';
      this.currenttab = 'variantgroup'
    }
  }

  getvariants() {
    this.Auth.getvariants(this.CompanyId).subscribe(data => {
      this.variants = data;
      console.log(this.variants)
      this.show = true
      // this.variantgroups.forEach(vg => {
      //   vg.count = this.variants.filter(x => x.variantGroupId = vg.id).length
      // });
      this.variants.forEach(v => {
        v.variantGroup = this.variantgroups.filter(x => x.id == v.variantGroupId)[0]
      });
      console.log(this.variants)
    })
  }

  getvariantgroups() {
    this.Auth.getvariantgroups(this.CompanyId).subscribe(data => {
      this.variantgroups = data;
      // this.variantgroups = this.variantgroups.filter(x => x.id == 0);
      this.show = true;
      console.log(this.variantgroups)
      this.getvariants();
    })
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.variants
      .filter(item => !item.disabled)
      .every(item => this.mapOfCheckedId[item.id])
    this.isIndeterminate =
      this.variants
        .filter(item => !item.disabled)
        .some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked
    this.numberOfChecked = this.variants.filter(item => this.mapOfCheckedId[item.id]).length
  }

  checkAll(value: boolean): void {
    this.variants
      .filter(item => !item.disabled)
      .forEach(item => (this.mapOfCheckedId[item.id] = value))
    this.refreshStatus()
  }

  variantValidation() {
    var isvalid = true;
    if (this.variant.name == '') isvalid = false;
    if (this.variant.price == 0) isvalid = false;
    if (this.variant.variantGroupId == 0) isvalid = false;

    return isvalid;
  }

  variantGroupValidation() {
    var isvalid = true;
    if (this.variantgroup.name == '') isvalid = false;
    return isvalid;
  }

  submitted: boolean = false;
  addVariant() {
    this.submitted = true;
    console.log(this.submitted);
    if (this.variantValidation()) {
      // this.variant.variantGroupId = +this.variant.variantGroupId;
      // this.variant.variantGroup = null
      console.log()
      if (this.variant.id == 0) {
        this.variant.action = "A"
        this.Auth.updateVariant(this.variant).subscribe(data => {
          console.log(data)
          if (this.datasavetype == "1") {
            this.Auth.addVariants_l(this.variant).subscribe(data => {
              console.log(data);
              this.submitted = false;
              this.variant = { id: 0, name: "", description: "", price: 0, sortOrder: -1, variantGroupId: 0, companyId: 1, action: "", count: "", variantGroup: null }
              this.variantgroup = { id: 0, name: "", description: "", sortOrder: -1, companyId: 1, action: "" }
              this.Auth.updateoptiondb().subscribe(data1 => {
                this.notification.success("Variant Added", "Variant Added Successfully")
                this.getvariants();
                console.log(this.getvariants())
              })
            })
          } else if (this.datasavetype == "2") {
            this.notification.success("Variant Added", "Variant Added Successfully")
            this.getvariants();
          }
        })
      } else {
        this.variant.action = "U"
        this.Auth.updateVariant(this.variant).subscribe(data => {
          console.log(data)
          if (this.datasavetype == "1") {
            this.Auth.updateVariant_l(this.variant).subscribe(data => {
              console.log(data);
              this.submitted = false;
              this.variant = { id: 0, name: "", description: "", price: 0, sortOrder: -1, variantGroupId: 0, companyId: 1, action: "", count: "", variantGroup: null }
              this.variantgroup = { id: 0, name: "", description: "", sortOrder: -1, companyId: 1, action: "" }
              this.Auth.updateoptiondb().subscribe(data1 => {
                this.notification.success("Variant Updated", "Variant Updated Successfully")
                this.getvariants();
              })
            })
          } else if (this.datasavetype == "2") {
            this.notification.success("Variant Updated", "Variant Updated Successfully")
            this.getvariants();
          }
        })
      }
    }

    else {
      this.notification.error("Error", "Variant Added UnSuccessfully")
    }
  }
  editVariant(variant) {
    console.log(variant)
    this.variant = variant;
    this.show = !this.show;
  }
  editVariantGroup(variantgroup) {
    console.log(variantgroup)
    this.variantgroup = variantgroup;
    this.show = !this.show;
  }

  addVariantGroup() {
    this.submitted = true;
    console.log(this.submitted);
    if (this.variantGroupValidation()) {
      if (this.variantgroup.id == 0) {
        this.variantgroup.action = "A"
        this.Auth.updateVariantGroups(this.variantgroup).subscribe(data => {
          console.log(data)
          if (this.datasavetype == "1") {
            this.Auth.addVariantGroups_l(this.variantgroup).subscribe(data2 => {
              this.submitted = false;
              this.variant = { id: 0, name: "", description: "", price: 0, sortOrder: -1, variantGroupId: 0, companyId: 1, action: "", count: "", variantGroup: null }
              this.variantgroup = { id: 0, name: "", description: "", sortOrder: -1, companyId: 1, action: "" }
              console.log(data2);
              this.Auth.updateoptiongroupdb().subscribe(data1 => {
                this.notification.success("Variant Group Added", "Variant Group Added Successfully")
                this.getvariantgroups();
              })
            })
          } else if (this.datasavetype == "2") {
            this.notification.success("VariantGroup Added", "VariantGroup Added Successfully")
            this.getvariantgroups();
          }
        })
      } else {
        this.variantgroup.action = "U"
        this.Auth.updateVariantGroups(this.variantgroup).subscribe(data => {
          console.log(data)
          if (this.datasavetype == "1") {
            this.Auth.updateVariantGroups_l(this.variantgroup).subscribe(data2 => {
              this.submitted = false;
              this.variant = { id: 0, name: "", description: "", price: 0, sortOrder: -1, variantGroupId: 0, companyId: 1, action: "", count: "", variantGroup: null }
              this.variantgroup = { id: 0, name: "", description: "", sortOrder: -1, companyId: 1, action: "" }
              console.log(data2);
              this.Auth.updateoptiongroupdb().subscribe(data1 => {
                this.notification.success("Variant Group Added", "Variant Group Updated Successfully")
                this.getvariantgroups();
              })
            })
          } else if (this.datasavetype == "2") {
            this.notification.success("VariantGroup Updated", "VariantGroup Updated Successfully")
            this.getvariantgroups();
          }
        })
      }
    }
    else {
      this.notification.error("Error", "Variant Group Added UnSuccessfully")
    }
  }

  back() {
    this.show = !this.show;
    this.submitted = false;
    this.variant = { id: 0, name: "", description: "", price: 0, sortOrder: -1, variantGroupId: 0, companyId: 1, action: "", count: "", variantGroup: null }
    this.variantgroup = { id: 0, name: "", description: "", sortOrder: -1, companyId: 1, action: "" }
  }
}
