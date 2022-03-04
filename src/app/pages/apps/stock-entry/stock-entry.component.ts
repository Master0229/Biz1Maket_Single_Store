import { Component, OnInit, HostListener, ViewChild, TemplateRef } from '@angular/core';
import * as moment from 'moment'
import { AuthService } from 'src/app/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-stock-entry',
  templateUrl: './stock-entry.component.html',
  styleUrls: ['./stock-entry.component.scss']
})
export class StockEntryComponent implements OnInit {
  @ViewChild('product', { static: false }) public productmodal: TemplateRef<any>;//productinput
  @ViewChild('barcode', { static: false }) public barcodemodel: TemplateRef<any>;//productinput
  @ViewChild('batchno', { static: false }) public batchnomodel: TemplateRef<any>;//productinput

  stockentry = { barcodeId: null, quantity: null, price: null, expiarydate: "", companyid: 1, storeid: 8, productid: 0, product: null, batchno: null, entrydatetime: "" }
  products: any = [];
  CompanyId: any;
  StoreId: any;
  inputValue: string = '';
  filterproduct = [];
  batchno: any = [];
  checked: Boolean = true;
  stockproduct = [];
  submitted: boolean = false;
  constructor(private Auth: AuthService, private modalService: NgbModal) { }
  // @HostListener('window:keyup', ['$event'])

  ngOnInit(): void {
    this.getStockProducts();
  }

  date = new Date();
  onChange(e) {
    console.log(e, moment(e), this.date)
  }
  openCustomClass(content) {
    this.modalService.open(content, { centered: true, size: 'xl' })
  }

  getStockProducts() {
    this.Auth.getStockProduct(this.CompanyId, this.StoreId).subscribe(data => {
      console.log(data)
      this.products = data["products"];
      this.products.forEach(prod => {
        prod.isexpired = false;
        if (new Date(prod.expiaryDate).getTime() < new Date().getTime()) {
          prod.isexpired = true;
        }
      });
    })
  }
  onInputAutocomplete() {
    this.filterproduct = this.products.filter(x => x.name.toLowerCase().includes(this.inputValue));
  }
  batchesbybarcode = [];
  searchbybarcode(barcodeid) {
    this.modalService.open(this.barcodemodel, { centered: true, size: 'lg' })
    this.batchesbybarcode = this.products.filter(x => x.barcodeId == barcodeid);
    // console.log(this.batchesbybarcode)
    // this.quantityel['nativeElement'].focus()
  }
  searchbyproduct(event) {
    this.submitted = true;
    // console.log(event)
    // console.log(event.element.nativeElement.id)
    // var product = this.products.filter(x => x.barcodeId == +event.element.nativeElement.id)[0]
    this.searchbybarcode(+event.element.nativeElement.id);
    // this.inputValue = product.name;
    // // document.getElementById("productautocomplete").nodeValue = product.Product;
    // this.stockentry.product = product;
    // this.stockentry.productid = product.productId;
    // this.stockentry.barcodeId = product.barcodeId;
    // this.quantityel['nativeElement'].focus()
    // this.modalService.open(this.productmodal, { centered: true, size: 'lg' })
  }
  batchesbybatchno = [];
  searchbybatchno() {
    this.modalService.open(this.batchnomodel, { centered: true, size: 'lg' })
    this.batchesbybatchno = this.products.filter(x => x.batchNo == this.stockentry.batchno)
  }

  addstockbybatch() {
    this.submitted = true;
    this.validation();
    if (this.batchmodalvalid) {
      var array = this.batchesbybatchno.filter(x => x.selected)
      array.forEach(item => {
        if (this.stockproduct.some(x => x.guid == item.guid)) {
          this.stockproduct.filter(x => x.guid == item.guid)[0].stockquantity += item.stockquantity
          console.log(item.stockquantity)
        } else {
          this.stockproduct.push(Object.assign({}, item))
        }
        this.products.filter(x => x.guid == item.guid)[0].quantity -= item.stockquantity
      })
      this.stockentry.batchno = null;
      this.modalService.dismissAll();
      this.productarrayreset();
    }
  }
  delete(index) {
    var guid = this.stockproduct[index].guid;
    this.products.filter(x => x.guid == guid)[0].quantity += this.stockproduct[index].stockquantity;
    this.stockproduct.splice(index, 1);
  }

  addstockbybarcode() {
    this.submitted = true;
    this.validation();
    if (this.batchmodalvalid) {
      var array = this.batchesbybarcode.filter(x => x.selected)
      console.log(array);
      array.forEach(item => {
        if (this.stockproduct.some(x => x.guid == item.guid)) {
          this.stockproduct.filter(x => x.guid == item.guid)[0].stockquantity += item.stockquantity
          console.log(item.stockquantity)
        } else {
          this.stockproduct.push(Object.assign({}, item))
        }
        this.products.filter(x => x.guid == item.guid)[0].quantity -= item.stockquantity
      })
      this.stockentry.barcodeId = null;
      this.inputValue = null;

      // this.stockproduct = [...array, ...this.stockproduct]
      this.modalService.dismissAll();
      // this.batchesbybarcode = [];
      // console.log(this.stockproduct)
      this.productarrayreset();
    }

  }
  productarrayreset() {
    this.products.forEach(product => {
      product.selected = false;
      product.stockquantity = null;
    });
  }
  batchmodalvalid = true;
  validation() {
    this.batchmodalvalid = this.products.some(x => x.selected == true) && this.products.some(x => x.stockquantity > 0) && !this.products.some(x => x.stockquantity > x.quantity);
  }
}
