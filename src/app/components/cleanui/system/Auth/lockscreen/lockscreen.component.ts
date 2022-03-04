import { Component } from '@angular/core'
import { NzNotificationService } from 'ng-zorro-antd'
import {Router} from '@angular/router';

@Component({
  selector: 'cui-system-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['../style.component.scss'],
})
export class LockscreenComponent {
  users = [];
  pin = '';
  constructor(private notification: NzNotificationService, private router: Router) {
    this.users = JSON.parse(localStorage.getItem("users"));
  }

  unlock(pin) {
    if (this.users.some(x => x.pin.toString() == pin)) {
      localStorage.setItem("user", JSON.stringify(this.users.filter(x => x.pin.toString() == pin)[0]));
      // this.notification.success("Logged In!", "Logged in successfully")
      this.router.navigateByUrl('/apps/sale');
    } else {
      this.notification.error("Pin Invalid", "Check your PIN")
    }
  }
}
