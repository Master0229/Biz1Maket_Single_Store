import { Injectable } from '@angular/core'
import { ElectronService } from 'ngx-electron'

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  printersettings: any
  loginfo: any
  constructor(private electronService: ElectronService) {}

  print(html, printers) {
    if (this.electronService.isElectronApp)
      this.electronService.remote.getGlobal('print')(1, printers, html)
  }
  printBarcode(options, data) {
    if (this.electronService.isElectronApp)
      this.electronService.remote.getGlobal('barcodePrint')(options, data)
  }
}
