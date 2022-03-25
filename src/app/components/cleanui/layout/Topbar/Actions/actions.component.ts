import { Component } from '@angular/core'
import { AuthService } from 'src/app/auth.service'
import { select, Store } from '@ngrx/store'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'

@Component({
  selector: 'cui-topbar-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class TopbarActionsComponent {
  stockchnageid: string = Guid.newGuid();
  constructor(
    private Auth: AuthService,
    private store: Store<any>,

  ) {
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      if(this.stockchnageid != state.stockchnageid) {
        this.getproducts()
      }
    })
  }

  ngOnInit(): void {
    this.getproducts()
  }

  products: any = []

  getproducts() {
    this.Auth.getendangeredproducts().subscribe(data => {
      this.products = data
      console.log(this.products)
    })
  }

}
class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
