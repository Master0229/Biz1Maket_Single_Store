import { Injectable } from '@angular/core'
import { AuthService } from 'src/app/auth.service'
import { EventService } from '../event/event.service'
import { select, Store } from '@ngrx/store'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  cansaveorder = true
  pendingorders: any = []
  cansavependingorder: boolean = true
  preorders: any = []
  cansavepreorder: boolean = true
  constructor(private auth: AuthService, private event: EventService, private store: Store<any>,) { }
  sync() {
    if (this.cansaveorder) {
      this.getorders()
      // this.getpurchaseorder()
    }
  }

  getorders() {
    this.event.emitNotif({ newerrororder: true })
    if (navigator.onLine) {
      if (this.pendingorders.length == 0) {
        this.cansavependingorder = false
        this.auth.getorders().subscribe(data => {
          this.pendingorders = data
          if (this.pendingorders.length > 0) this.saveorders()
          else this.cansavependingorder = true
        })
      } else {
        this.saveorders()
      }
    } else {
      setTimeout(() => {
        this.getorders()
      }, 30000)
    }
  }
  // saveorders() {
  //   var order = this.pendingorders.shift()
  //   this.auth.saveorder({ OrderJson: JSON.stringify(order) }).subscribe(
  //     data => {
  //       this.preorders = data
  //       console.log(this.preorders)
  //       var responselogdata = {
  //         invoiceno: order.InvoiceNo,
  //         loggeddatetime: new Date().getTime(),
  //         response: data,
  //       }
  //       this.logresponse(responselogdata)
  //       if (data['status'] == 200 || data['status'] == 409) {
  //         this.auth.transactionsinvoice(order.InvoiceNo).subscribe(trdt => {
  //           var transactions: any = trdt
  //           if (transactions.length > 0) {
  //             transactions.forEach(tr => {
  //               tr.OrderId = data['data'][0].OrderId
  //             })
  //             this.auth.ordertransaction(transactions).subscribe(otdt => {
  //               this.auth.deleteorderfromnedb(order._id, order.InvoiceNo).subscribe(ddata => {
  //                 this.getorders()
  //               })
  //             })
  //           } else {
  //             this.auth.deleteorderfromnedb(order._id, order.InvoiceNo).subscribe(ddata => {
  //               this.getorders()
  //             })
  //           }
  //         })
  //       } else if (data['status'] == 409) {
  //         order.status = 'D'
  //         this.auth.updateordertonedb(order).subscribe(ddata => {
  //           this.getorders()
  //         })
  //       } else if (data['status'] == 500) {
  //         order.status = 'E'
  //         order.error = data['error']
  //         this.auth.updateordertonedb(order).subscribe(ddata => {
  //           this.getorders()
  //         })
  //       }
  //     },
  //     error => {
  //       this.getorders()
  //     },
  //   )
  // }
  //////////////////////SALE
  // getorders() {
  //   if (navigator.onLine) {
  //     if (this.pendingorders.length == 0) {
  //       this.cansaveorder = false
  //       this.auth.getorderdb(6).subscribe(data => {
  //         this.pendingorders = data
  //         if (this.pendingorders.length > 0)
  //           this.saveorders()
  //         else
  //           this.cansaveorder = true
  //       })
  //     } else {
  //       this.saveorders()
  //     }
  //   } else {
  //     setTimeout(() => {
  //       this.getorders()
  //     }, 30000);
  //   }
  // }
  saveorders() {
    var order = this.pendingorders.shift()
    this.auth.saveorder({ "OrderJson": JSON.stringify(order) }).subscribe(data => {
      if (data["status"] == 200 || data["status"] == 409) {
        this.auth.getstoredata(order.CompanyId, order.StoreId, 1).subscribe(data1 => {
          console.log(data1)
          this.auth.getstoredatadb(data1).subscribe(d => {
            this.store.dispatch(
              new SettingsActions.SetStateAction({
                stockchnageid: Guid.newGuid(),
              }),
            )
          })
          this.auth.deleteorderfromnedb(order._id, data["stockBatches"]).subscribe(ddata => {
            this.getorders()
            this.store.dispatch(
              new SettingsActions.SetStateAction({
                stockchnageid: Guid.newGuid(),
              }),
            )
          })
        })
      } else {
        this.getorders()
      }
    }, error => {
      this.getorders()
    })
  }
  /////////////////////////////////////////// PURCHASE
  // getpurchaseorder() {
  //   if (navigator.onLine) {
  //     if (this.pendingorders.length == 0) {
  //       this.cansaveorder = false
  //       this.auth.getorderdb(1).subscribe(data => {
  //         this.preorders = data
  //         console.log(this.preorders)
  //         if (this.preorders.length > 0)
  //           this.savepurchaseorder()
  //         else
  //           this.cansaveorder = true
  //       })
  //     } else {
  //       this.savepurchaseorder()
  //     }
  //   } else {
  //     setTimeout(() => {
  //       this.getpurchaseorder()
  //     }, 30000);
  //   }
  // }
  // savepurchaseorder() {
  //   var order = this.preorders.shift()
  //   console.log(order)
  //   if (order.OrderType == 1) {
  //     this.auth.savepurchase(order).subscribe(data => {
  //       if (data["status"] == 200) {
  //         this.auth.deleteorderfromnedb(order._id, data["stockBatches"]).subscribe(ddata => {
  //           this.getpurchaseorder()
  //         })
  //         console.log(order.status)
  //       } else if (data["status"] == 409) {
  //         order.status = "D"
  //         this.auth.updatepurchaseorder(order).subscribe(ddata => { this.getpurchaseorder() })
  //       } else if (data["status"] == 500) {
  //         order.status = "E"
  //         order.error = data["error"]
  //         this.auth.updatepurchaseorder(order).subscribe(ddata => { this.getpurchaseorder() })
  //       }
  //     }, error => {
  //       order.status = "E"
  //       console.log(order.status)
  //       this.auth.updatepurchaseorder(order).subscribe(ddata => { this.getpurchaseorder() })
  //     })
  //   }
  // }
  logresponse(logdata) {
    this.auth.logordersaveresponse(logdata).subscribe(data => { })
  }
}

class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
