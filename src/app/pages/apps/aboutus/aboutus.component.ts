import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { version } from 'package.json'
import { AuthService } from 'src/app/auth.service'
import compareVersions from 'compare-versions';
import { ElectronService } from 'ngx-electron';
import { select, Store } from '@ngrx/store'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'
import { UpdateService } from 'src/app/services/update/update.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss'],
})
export class AboutusComponent implements OnInit {
  version: string = version
  updateAvailable: boolean = false
  squirrelUpdateUrl: string = ''
  updating: boolean = false
  updated: boolean = false
  loading: boolean = false
  lastChecked: Date
  lastCheckedStamp: number = 0
  availableVersion: string = ''
  body: string = ''

  constructor(
    private store: Store<any>,
    private auth: AuthService,
    private electronS: ElectronService,
    public updateS: UpdateService
  ) {
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      console.log(state)
    })
    if (this.electronS.isElectronApp) {

      this.electronS.ipcRenderer.on('update-available', (event, isupdateavailable) => {
        console.log(isupdateavailable)
        this.updating = !isupdateavailable
        this.updated = true
      })

      this.electronS.ipcRenderer.on('update-error', (event, error) => {
        console.log(error)
      })

      this.electronS.ipcRenderer.on('update-downloaded', (event, isupdatecomplete) => {
        this.updating = !isupdatecomplete
        this.updated = true
      })
    }
    this.lastCheckedStamp = +localStorage.getItem("last-checked")
    this.lastChecked = new Date(this.lastCheckedStamp)
  }

  ngOnInit(): void { }

  checkForUpdates() {
    this.updateS.checkForUpdate()
    // console.log("checking for updates...")
    // this.loading = true
    // this.auth.checkForUpdates().subscribe(data => {
    //   this.loading = false
    //   console.log(data)
    //   this.updateAvailable = compareVersions.compare(data["tag_name"].replace(/[A-Za-z]/g, ""), version, '>')
    //   this.squirrelUpdateUrl = data["assets"].filter(x => x.name == "RELEASES")[0].browser_download_url.replace('/RELEASES', '')
    //   localStorage.setItem("last-checked", (new Date().getTime()).toString())
    //   this.lastCheckedStamp = +localStorage.getItem("last-checked")
    //   this.lastChecked = new Date(this.lastCheckedStamp)
    //   this.availableVersion = data["tag_name"].replace(/[A-Za-z]/g, "")
    //   this.body = data["body"]
    //   this.store.dispatch(
    //     new SettingsActions.SetStateAction({
    //       squirrelUpdateUrl: this.squirrelUpdateUrl,
    //       updateAvailable: this.updateAvailable,
    //     }),
    //   )
    // })
  }

  startUpdate() {
    // if (this.electronS.isElectronApp) {
    //   this.updating = true
    //   this.electronS.ipcRenderer.send('start-update', this.squirrelUpdateUrl)
    // }
    this.updateS.startUpdate()
  }

  quintAndInstallUpdate() {
    if (this.electronS.isElectronApp)
      this.electronS.ipcRenderer.send('app-relaunch', "for-update-install")
  }
}
