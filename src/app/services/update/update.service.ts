import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { AuthService } from 'src/app/auth.service';
import { version } from 'package.json'
import { select, Store } from '@ngrx/store'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'
import compareVersions from 'compare-versions';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  public updateStatus: number = 0
  public lastChecked: Date
  public availableVersion: string = ''
  squirrelUpdateUrl: string = ''
  version: string = ''
  constructor(
    private store: Store<any>,
    private auth: AuthService,
    private electronS: ElectronService) {
    this.lastChecked = localStorage.getItem("last-checked") ? new Date(+localStorage.getItem("last-checked")) : null
    this.version = version
    if (this.electronS.isElectronApp) {
      this.ipc_renderer_configure()
    }
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      if (this.updateStatus != state.updateStatus)
        this.updateStatus = state.updateStatus
    })
  }

  checkForUpdate() {
    this.auth.checkForUpdates().subscribe(data => {
      this.updateStatus = compareVersions(data["tag_name"].replace(/[A-Za-z]/g, ""), version)
      this.squirrelUpdateUrl = data["assets"].filter(x => x.name == "RELEASES")[0].browser_download_url.replace('/RELEASES', '')
      this.updateLastChecked()
      this.availableVersion = data["tag_name"].replace(/[A-Za-z]/g, "")
      this.store.dispatch(
        new SettingsActions.SetStateAction({
          updateStatus: this.updateStatus,
        }),
      )
    })
  }

  updateLastChecked() {
    localStorage.setItem("last-checked", (new Date().getTime()).toString())
    this.lastChecked = new Date(+localStorage.getItem("last-checked"))
  }

  startUpdate() {
    console.log(this.squirrelUpdateUrl)
    if (this.electronS.isElectronApp) {
      this.electronS.ipcRenderer.send('start-update', this.squirrelUpdateUrl)
    }
  }

  ipc_renderer_configure() {
    this.electronS.ipcRenderer.on('update-available', (event, isupdateavailable) => {
      console.log(isupdateavailable)
      this.store.dispatch(
        new SettingsActions.SetStateAction({
          updateStatus: 2,
        }),
      )
    })

    this.electronS.ipcRenderer.on('update-error', (event, error) => {
      console.log(error)
      this.store.dispatch(
        new SettingsActions.SetStateAction({
          updateStatus: 0,
        }),
      )
    })

    this.electronS.ipcRenderer.on('update-downloaded', (event, isupdatecomplete) => {
      this.store.dispatch(
        new SettingsActions.SetStateAction({
          updateStatus: 3,
        }),
      )
    })
  }
}
