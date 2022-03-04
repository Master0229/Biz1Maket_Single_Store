import { Component } from '@angular/core'
import { select, Store } from '@ngrx/store'
import * as UserActions from 'src/app/store/user/actions'
import * as Reducers from 'src/app/store/reducers'
import { ConstantsService } from "../../../../../services/constants/constants.service";
import { NzNotificationService } from 'ng-zorro-antd'
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'cui-topbar-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class TopbarUserMenuComponent {
  badgeCount: number = 0
  name: string = ''
  role: string = ''
  email: string = ''
  phone: string = ''
  datasavetype: string = '1';
  user: any
  constructor(private store: Store<any>, private globals: ConstantsService,
    private notification: NzNotificationService, private Auth: AuthService) {
    this.user = JSON.parse(localStorage.getItem("user"))
    // this.store.pipe(select(Reducers.getUser)).subscribe(state => {
    this.name = this.user?.name
    this.role = this.user?.role?.name
    this.email = globals.email;
    this.datasavetype = localStorage.getItem("datasavetype");

  }

  badgeCountIncrease() {
    this.badgeCount = this.badgeCount + 1
  }

  logout() {
    this.store.dispatch(new UserActions.Logout())
  }

  sync() {
    this.Auth.syncdata().subscribe(data => {
      console.log(data)
      this.notification.success("Variant Added", "Successfully")
    })
  }
}
