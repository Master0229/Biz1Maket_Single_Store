import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { HttpClient, HttpResponse } from '@angular/common/http'
import store from 'store'

@Injectable()
export class jwtAuthService {
  base_url1 = "https://localhost:44383/api/";
  base_url = "https://biz1retail.azurewebsites.net/api/";

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    console.log("qwertyuioplkjhgfdsa")
    return this.http.post(this.base_url + 'Login/LoginCheck', { email, password })
  }

  register(email: string, password: string, name: string): Observable<any> {
    return this.http.post('/api/auth/register', { email, password, name })
  }

  currentAccount(): Observable<any> {
    const accessToken = store.get('accessToken')
    const params = accessToken
      ? {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          AccessToken: accessToken,
        },
      }
      : {}

    return of(new HttpResponse({ status: 200 }))
  }

  logout(): Observable<any> {
    return this.http.get('/api/auth/logout')
  }
}
