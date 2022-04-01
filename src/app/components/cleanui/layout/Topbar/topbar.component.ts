import { Component } from '@angular/core'
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cui-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  loginfo: any;
  CompanyId: any;
  StoreId: any;
  constructor(private Auth: AuthService,  private router: Router){

  }

  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.CompanyId
      this.StoreId = this.loginfo.StoreId
      console.log(this.loginfo)
      // this.sync()
    })
  }

  sync() {
    this.Auth.getstoredata(this.loginfo.companyId, this.loginfo.storeId, 1).subscribe(data1 => {
      console.log(data1)
      this.Auth.getstoredatadb(data1).subscribe(d => {
        this.router.navigateByUrl('/auth/pinscreen')
      })
    })
  }
}
