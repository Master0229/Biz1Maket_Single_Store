import { Component } from '@angular/core'
import { AuthService } from 'src/app/auth.service'
import { NzNotificationService } from 'ng-zorro-antd'


@Component({
  selector: 'app-advanced-pricing-tables',
  templateUrl: './pricing-tables.component.html',
})
export class AdvancedPricingTablesComponent {

  value?: string;
  value1?: string;

  plans: any
  plandetail: any
  loginfo
  CompanyId: any
  StoreId: any
  planId: any


  constructor(private Auth: AuthService, private notification: NzNotificationService,) { }
  ngOnInit() {

    this.Auth.getdbdata(['loginfo', 'printersettings']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
    })
    this.gettestplan()
  }

  gettestplan() {
    const classNames = {
      "Free Plan": "",
      "Standard Plan": "bg-light",
      "Premium Plan": "bg-primary text-white"
    }
    this.Auth.getplan().subscribe(data => {
      this.plans = data
      console.log(this.plans)
      this.plans.forEach(plan => {
        plan.className = classNames[plan.name] //bg-primary text-white
        plan.btntext = "Get Access"
        plan.disabled = false
        plan.accessible = plan.id == 2 ? false : true
      });
      console.log(this.plans);
      this.gettestplandetails()
    })
  }

  gettestplandetails() {
    this.Auth.Testplandetail().subscribe((data: any) => {
      console.log(this.plandetail);
      this.plans.forEach(plan => {
        plan.details = data.filter(x => x.planId == plan.id)
      });
    })
  }
  btnText = 'Get Access';
  btnDisabled = false;

  getplanAccess(planid) {

    this.btnDisabled = true;
    this.btnText = 'Mail Sent';
    this.plans.filter(x => x.id == planid)[0].btntext = "Mail Sent"
    this.plans.filter(x => x.id == planid)[0].disabled = true
    setTimeout(() => {
      this.plans.filter(x => x.id == planid)[0].btntext = "Get Access"
      this.plans.filter(x => x.id == planid)[0].disabled = false
    }, 5000);

    this.notification.success('Mail Sent!', ` `,)

    this.Auth.getaccess(this.loginfo.companyId, this.loginfo.storeId, planid).subscribe((data: any) => {

      console.log(data)
    })
  }

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  // handleOk(): void {
  //   this.getplanAccess()
  //   // this.sendmail()
  //   console.log('Button ok clicked!');

  // }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
