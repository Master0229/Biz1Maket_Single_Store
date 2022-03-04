import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { select, Store } from '@ngrx/store'
import * as Reducers from 'src/app/store/reducers'
import * as UserActions from 'src/app/store/user/actions'
import * as SettingsActions from 'src/app/store/settings/actions'
import { AuthService } from 'src/app/auth.service';
import { NzNotificationService } from 'ng-zorro-antd'


@Component({
  selector: 'cui-system-register',
  templateUrl: './register.component.html',
  styleUrls: ['../style.component.scss'],
})
export class RegisterComponent {
  form: FormGroup
  loading: boolean = false

  constructor(private fb: FormBuilder, private store: Store<any>,private Auth: AuthService,private notification: NzNotificationService) {
    this.form = fb.group({
      Name: [, [Validators.required, Validators.minLength(4)]],
      Email: [, [Validators.required]],
      Password: [, [Validators.required]],
      ConfirmPassword: ['', [Validators.required]]
    }, {
      validators: this.confirmpasswordvalidation.bind(this)
    })
    this.store.pipe(select(Reducers.getUser)).subscribe(state => {
      this.loading = state.loading
    })
  }
  confirmpasswordvalidation(formGroup: FormGroup) {
    const { value: password } = formGroup.get('Password');
    const { value: confirmPassword } = formGroup.get('ConfirmPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }


  get email() {
    return this.form.controls.Email
  }
  get password() {
    return this.form.controls.Password
  }
  get name() {
    return this.form.controls.Name
  }
  get confirmpassword() {
    return this.form.controls.ConfirmPassword
  }

  submitForm(): void {
    this.email.markAsDirty()
    this.email.updateValueAndValidity()
    this.password.markAsDirty()
    this.password.updateValueAndValidity()
    this.name.markAsDirty()
    this.name.updateValueAndValidity()
    if (this.email.invalid || this.password.invalid || this.name.invalid || this.confirmpassword.invalid || this.confirmpasswordvalidation(this.form)?.passwordNotMatch) {
      return
    }
    console.log(this.form.value)
    this.Auth.registration(this.form.value).subscribe(data => {
      console.log(data)
    })
    this.notification.success("Registered Successfully", `Registered successfully.`)

    // const payload = {
    //   email: this.email.value,
    //   password: this.password.value,
    //   name: this.name.value,
    // }
    // this.store.dispatch(new UserActions.Register(payload))
    // this.Auth.registration()
  }
}
