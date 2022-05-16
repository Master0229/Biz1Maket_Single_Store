import { Component, OnInit } from '@angular/core'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { NzNotificationService } from 'ng-zorro-antd'
import { AuthService } from 'src/app/auth.service'
import { Location } from '@angular/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import * as moment from 'moment'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  CompanyId: any
  StoreId: any
  id: any
  taxgroups: any
  taxGroupId: number
  producttypes: any
  units: any
  // kotgroups: any
  categories: any
  masterproduct: any = []
  show = true
  product: any = {
    id: 0,
    name: '',
    barCode: null,
    description: '',
    brand: '',
    categoryId: 0,
    taxGroupId: 0,
    productTypeId: 0,
    unitId: 0,
    // kotGroupId: 0,
    price: null,
    productCode: null,
    CompanyId: 1,
    action: '',
  }
  isvisible: boolean
  visible = false
  checked: Boolean = true
  listOfSearchName: string[] = []
  listOfSearchAddress: string[] = []
  // term: string = '';
  term: ''
  https = 0
  prod: any
  products: any
  barcodes: any = []
  variantcombinations: any = []
  categoryvariantgroups: any = []
  variantcombination: any
  barcodevariants: any = []
  datasavetype: string = '1'
  prodid = ''
  // listOfData = orders
  // listOfDisplayData = [...this.listOfData]
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
  loginfo: any
  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    public location: Location,
  ) {
    // var logInfo = JSON.parse(localStorage.getItem("loginInfo"));
    // this.CompanyId = logInfo.CompanyId;
  }
  // listOfPosition: NzPlacementType[] = [
  //   'bottomLeft'
  // ]
  // contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
  //   this.nzContextMenuService.create($event, menu)
  // }

  // closeMenu(): void {
  //   this.nzContextMenuService.close()
  // }
  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'printersettings']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
      this.getMasterproduct()
      this.gettax()
      this.getproducttype()
      this.getUnits()
      // this.getKotGroups()
      this.getCategories()
    })
  }
  open(): void {
    this.visible = true
  }

  close(): void {
    this.visible = false
  }
  arrayBuffer: any
  file: File
  incomingfile(event) {
    this.file = event.target.files[0]
    console.log(this.file)
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

  active(id, act) {
    console.log(id, act)
    this.Auth.prdactive(id, act).subscribe(data => {
      this.getMasterproduct()
    })
  }

  showInactive: Boolean = false
  changefilter(bool) {
    this.showInactive = bool
    console.log(bool)
    if (bool) {
      this.prod = this.masterproduct.products.filter(x => !x.isactive)
    } else {
      this.prod = this.masterproduct.products.filter(x => x.isactive)
    }
    console.log(this.prod.length)
  }

  strdate: string
  enddate: string
  date: { year: number; month: number }
  dateRange = []

  onChange(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')
    this.getMasterproduct()
  }


  getMasterproduct() {
    this.Auth.getProduct(this.id, this.loginfo.companyId, this.strdate, this.enddate,).subscribe(data => {
      this.masterproduct = data
      this.prod = this.masterproduct.products.filter(x => x.isactive == !this.showInactive)
      console.log(this.prod)
    })
  }
  gettax() {
    this.Auth.GetTaxGrp(this.loginfo.companyId).subscribe(data => {
      this.taxgroups = data
      this.product.taxGroupId = this.taxgroups[0].id
      console.log(this.taxgroups);
    })
  }
  getproduct(id) {
    if (this.prodid != '0') {
      this.Auth.getproductbyid(id).subscribe(data => {
        // console.log(data);
        this.product = data['product']
        console.log(this.product)
        this.barcodes = data['barcodes']
        this.barcodevariants = data['barcodevariants']
        this.barcodes.forEach(bc => {
          bc.vids = []
          bc.com_code = ''
          this.barcodevariants
            .filter(x => x.barcodeId == bc.id)
            .forEach(bcv => {
              bc.vids.push(bcv.variantId)
            })
          bc.com_code = bc.vids.sort().join('_')
        })
        // console.log(this.categoryvariantgroups.length)
        this.getcategoryvariants()
      })
    } else {
      this.getcategoryvariants()
    }
    // this.show = !this.show;
    this.getMasterproduct()
  }
  getproducttype() {
    this.Auth.getProductType().subscribe(data => {
      this.producttypes = data
      this.product.productTypeId = this.producttypes[0].id
      // console.log(data);
    })
  }
  getUnits() {
    this.Auth.getUnits().subscribe(data => {
      this.units = data
      this.product.unitId = this.units[0].id
      // console.log(data);
    })
  }
  // getKotGroups() {
  //   this.Auth.getKotgroups().subscribe(data => {
  //     this.kotgroups = data
  //     this.product.kotGroupId = this.kotgroups[0].id
  //     // console.log(data);
  //   })
  // }
  getCategories() {
    this.Auth.getcategories(this.loginfo.companyId, 'A').subscribe(data => {
      this.categories = data
      this.product.categoryId = this.categories[0].id
      this.getMasterproduct()
      // console.log(this.categories);
    })
  }
  validation() {
    var isvalid = true
    if (this.product.categoryId == 0) isvalid = false
    if (this.product.productTypeId == 0) isvalid = false
    if (this.product.taxGroupId == 0) isvalid = false
    if (this.product.unitId == 0) isvalid = false
    if (this.product.name == '') isvalid = false
    // if (this.product.barcodeid == null) isvalid = false;
    if (this.product.description == '') isvalid = false
    if (this.product.brand == '') isvalid = false
    if (this.product.price == null) isvalid = false
    if (this.product.productCode == null) isvalid = false

    // if (this.product.name == '') isvalid = false;

    return isvalid
  }
  back() {
    this.show = !this.show
    this.product = {
      id: 0,
      name: '',
      barCode: null,
      description: '',
      brand: '',
      categoryId: 0,
      taxGroupId: 0,
      productTypeId: 0,
      unitId: 0,
      // kotGroupId: 0,
      price: null,
      productCode: null,
      // CompanyId: 1,
      action: '',
    }
  }
  submitted: boolean = false
  addProduct() {
    this.product.CompanyId = this.CompanyId;
    this.submitted = true
    if (this.validation()) {
      if (this.product.id == 0) {
        // // console.log(this.product.id)
        this.product.action = 'A'
        this.Auth.updateProduct(this.product).subscribe(data => {
          console.log(data)
          if (this.datasavetype == '1') {
            this.Auth.addproduct_l({
              product: this.product,
              variantcombinations: this.combinations,
            }).subscribe(data => {
              console.log(data)
              this.Auth.updateproductdb().subscribe(data2 => {
                this.notification.success('Product Added', 'Product Added Successfully')
                this.show = !this.show
                this.getMasterproduct()
              })
            })
          } else if (this.datasavetype == '2') {
            this.notification.success('Product Added', 'Product Added Successfully')
            this.show = !this.show
          }
        })
      } else {
        // console.log(this.product.id)
        this.product.action = 'U'
        this.Auth.updateProduct({
          product: this.product,
          variantcombinations: this.combinations,
        }).subscribe(data => {
          console.log(data)
          if (this.datasavetype == '1') {
            this.Auth.updateproduct_l({
              product: this.product,
              variantcombinations: this.combinations,
            }).subscribe(data => {
              console.log(data)
              this.Auth.updateproductdb().subscribe(data2 => {
                this.notification.success('Product Updated', 'Product Updated Successfully')
                this.back()
              })
            })
          } else if (this.datasavetype == '2') {
            this.notification.success('Product Updated', 'Product Updated Successfully')
            this.back()
          }
        })
      }
    } else {
      this.notification.error('Error', 'Product Added UnSuccessfully')
    }
    this.getMasterproduct()
  }
  variantgroupobj: any = {}
  getcategoryvariants() {
    // // console.log(this.product.categoryId)
    this.variantcombination = null
    this.variantgroupobj = {}
    this.combinations = []
    this.Auth.getcategoryvariants(this.product.categoryId).subscribe(data => {
      // // console.log(data)
      this.categoryvariantgroups = data
      this.categoryvariantgroups.forEach(cvg => {
        this.variantgroupobj[cvg.variantGroupName] = cvg.variants
      })
      // console.log(this.barcodes, this.barcodevariants)
      if (this.barcodes && this.barcodevariants) this.setcvselect()
    })
  }
  setcvselect() {
    // console.log('setcvselect')
    if (this.variantcombination == (undefined || null)) this.variantcombination = {}
    this.categoryvariantgroups.forEach(cvg => {
      cvg.variants.forEach(v => {
        if (this.barcodevariants.some(x => x.variantId == v.id)) {
          cvg.selected = true
          v.selected = true
          if (!this.variantcombination[cvg.variantGroupId])
            this.variantcombination[cvg.variantGroupId] = []
          this.variantcombination[cvg.variantGroupId].push(v.id)
        }
      })
    })
    // console.log(this.variantcombination)
    this.getallcombinations(Object.values(this.variantcombination))
  }
  combinations = []
  keys = []
  variantchecked(vgid, vid, e) {
    this.combinations = []
    if (this.variantcombination == (undefined || null)) this.variantcombination = {}

    if (e.target.checked) {
      if (this.variantcombination[vgid] == (undefined || null)) this.variantcombination[vgid] = []
      this.variantcombination[vgid].push(vid)
    } else {
      var index = this.variantcombination[vgid].indexOf(vid)
      this.variantcombination[vgid].splice(index, 1)
    }
    Object.keys(this.variantcombination).forEach(key => {
      if (this.variantcombination[key].length == 0) delete this.variantcombination[key]
    })
    // console.log(this.variantcombination)
    this.getallcombinations(Object.values(this.variantcombination))
  }
  getallcombinations(args) {
    this.combinations = []
    this.variantcombinations = []
    var r = []
    var max = args.length - 1
    function helper(arr, i) {
      for (var j = 0, l = args[i].length; j < l; j++) {
        var a = arr.slice(0) // clone arr
        a.push(args[i][j])
        if (i == max) r.push(a)
        else helper(a, i + 1)
      }
    }
    if (args.length > 0) helper([], 0)
    else r = []
    this.variantcombinations = r
    this.keys = []
    // var variantsgroupobj:any = {};
    this.categoryvariantgroups.forEach(cvg => {
      if (cvg.variants.some(x => x.selected == true)) {
        cvg.selected = true
        this.keys.push(cvg.variantGroupName)
        // variantsgroupobj[cvg.variantGroupName] = cvg.variants;
      } else {
        cvg.selected = false
      }
    })
    var obj: any = {}
    this.variantcombinations.forEach(vcb => {
      obj.product = this.product.name
      this.keys.forEach(key => {
        obj[key] = this.getvariantname(vcb, key)
      })
      obj.barcode = this.getbarcode(vcb).barcode
      obj.variantids = vcb
      obj.id = this.getbarcode(vcb).id
      // console.log(obj)
      this.combinations.push(Object.assign({}, obj))
    })
  }
  getvariantname(arr, key) {
    var variantarray = this.variantgroupobj[key]
    var variantname = ''
    arr.forEach(id => {
      if (variantarray.some(x => x.id == id)) {
        variantname = variantarray.filter(x => x.id == id)[0].name
      }
    })
    // console.log(arr)
    return variantname
  }
  getbarcode(vids) {
    var data = { barcode: '', id: 0 }
    var barcode = ''
    var com_code = vids.sort().join('_')
    // console.log(this.barcodes, com_code)
    if (this.barcodes.some(x => x.com_code == com_code)) {
      data.barcode = this.barcodes.filter(x => x.com_code == com_code)[0].barCode
      data.id = this.barcodes.filter(x => x.com_code == com_code)[0].id
    }
    return data
  }
  setcombinationname() {
    this.combinations.forEach(cmb => {
      cmb.product = this.product.name
      console.log(this.product.name)
    })
  }
  // getCategories() {
  //   this.Auth.getCategory(this.loginfo.CompanyId).subscribe(data => {
  //     this.categories = data;
  //     console.log(this.categories);

  //   });
  // }
  // setproducts() {
  //   // this.masterproduct.forEach(prod => {
  //   //   prod.category = this.categories.filter(x => x.id == prod.categoryId)[0];
  //   //   prod.taxGroup = this.taxgroups.filter(x => x.id == prod.taxGroupId)[0];
  //   // });
  //   this.filteredvalues = this.masterproduct;
  //   console.log(this.masterproduct)
  // }

  filteredvalues = [];
  filtersearch(): void {
    this.prod = this.term
      ? this.masterproduct.products.filter(x => x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.masterproduct.products;
    console.log(this.prod)
  }
}
