import { Component, OnInit } from '@angular/core'
import { AuthService } from 'src/app/auth.service'


@Component({
  selector: 'kit-list-21',
  templateUrl: './21.component.html',
})
export class CuiList21Component implements OnInit {
  constructor( private Auth: AuthService,) { }
  ngOnInit() {
    this.gettestplan()
  }

  gettestplan(){
    this.Auth.getplan().subscribe (data => {
      console.log(data)
    })
  }
}
