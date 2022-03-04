import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule, LOCALE_ID } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material'

import { JwtInterceptor } from './services/interceptors/jwt.interceptors'

import { NgProgressModule } from '@ngx-progressbar/core'
import { NgProgressRouterModule } from '@ngx-progressbar/router'
import { NgProgressHttpModule } from '@ngx-progressbar/http'
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore'
import { Ng2SearchPipeModule } from 'ng2-search-filter'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { reducers, metaReducers } from './store/reducers'
import { UserEffects } from './store/user/effects'
import { firebaseConfig, firebaseAuthService } from './services/firebase'
import { jwtAuthService } from './services/jwt'
import { MockHttpCallInterceptor } from './services/fakeApi'
import { ElectronService, NgxElectronModule } from 'ngx-electron'

// locale resistration
import { registerLocaleData } from '@angular/common'
import { default as localeEn } from '@angular/common/locales/en'
import { NZ_I18N, en_US as localeZorro } from 'ng-zorro-antd'
const LOCALE_PROVIDERS = [
  { provide: LOCALE_ID, useValue: 'en' },
  { provide: NZ_I18N, useValue: localeZorro },
]
registerLocaleData(localeEn, 'en')

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    NgxElectronModule,
    Ng2SearchPipeModule,
    // translate
    TranslateModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),

    // ngrx
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([UserEffects]),
    StoreRouterConnectingModule.forRoot(),

    // nprogress
    NgProgressModule.withConfig({
      thick: true,
      spinner: false,
      color: '#0190fe',
    }),
    NgProgressRouterModule,
    NgProgressHttpModule,

    // init firebase
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [
    // auth services
    firebaseAuthService,
    jwtAuthService,
    ElectronService,
    // fake http interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockHttpCallInterceptor,
      multi: true,
    },

    // locale providers
    ...LOCALE_PROVIDERS,

    // firestore settings
    { provide: SETTINGS, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
