import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { select, Store } from '@ngrx/store'
import * as Reducers from 'src/app/store/reducers'
import * as UserActions from 'src/app/store/user/actions'
import * as SettingsActions from 'src/app/store/settings/actions'
import { AuthService } from 'src/app/auth.service'
import { Router } from '@angular/router'
import { ConstantsService } from '../../../../../services/constants/constants.service'

@Component({
  selector: 'cui-system-login',
  templateUrl: './login.component.html',
  styleUrls: ['../style.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup
  logo: String
  authProvider: string = 'jwt'
  loading: boolean = false
  isloggedin: boolean = false
  stores = []
  companyId = 0
  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private Auth: AuthService,
    private router: Router,
    private globals: ConstantsService,
  ) {
    this.form = fb.group({
      EmailId: ['', [Validators.required, Validators.minLength(4)]],
      Password: ['', [Validators.required]],
    })
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.logo = state.logo
      this.authProvider = state.authProvider
    })
    this.store.pipe(select(Reducers.getUser)).subscribe(state => {
      this.loading = state.loading
    })
  }
  ngOnInit() {
    // this.getproducts();
    // this.globals.getupdated().subscribe(data => {
    //   console.log(data)
    // })
  }
  // getproducts() {
  //   this.Auth.getstoredata().subscribe(data => {
  //     console.log(data)
  //   })
  // }
  get email() {
    return this.form.controls.EmailId
  }
  get password() {
    return this.form.controls.Password
  }

  submitForm(): void {
    this.globals.listener().subscribe(data => {
      this.isloggedin = data['loggedin']
      this.stores = data['stores']
      this.companyId = data['companyId'][0]['companyId']
      // console.log()
    })
    this.email.markAsDirty()
    this.email.updateValueAndValidity()
    this.password.markAsDirty()
    this.password.updateValueAndValidity()
    if (this.email.invalid || this.password.invalid) {
      return
    }
    const payload = {
      email: this.email.value,
      password: this.password.value,
    }
    this.store.dispatch(new UserActions.Login(payload))
    // this.Auth.login(payload).subscribe(data => {
    //   console.log(data);
    //   this.stores = data["stores"];
    //   this.isloggedin = true;
    //   this.companyId = data["companyId"][0]["companyId"]
    // })
  }

  setProvider(authProvider) {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        authProvider,
      }),
    )
  }
  getusers(id) {
    this.Auth.getusers(id, this.companyId).subscribe(data => {
      console.log(data)
      this.Auth.getstoredata(this.companyId, id, 1).subscribe(data1 => {
        console.log(data1)
        this.Auth.getstoredatadb(data1).subscribe(d => {})
      })
      localStorage.setItem('users', JSON.stringify(data))
      localStorage.setItem("logState", "logged_in")
      this.router.navigate(['/auth/pinscreen'])
    })
  }
}
