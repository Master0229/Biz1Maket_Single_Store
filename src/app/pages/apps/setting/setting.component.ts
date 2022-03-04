import { Component, OnInit } from '@angular/core'
import { ElectronService } from 'ngx-electron'
import { AuthService } from 'src/app/auth.service'
import { NzNotificationService } from 'ng-zorro-antd'
// import { NzNotificationService } from 'ng-zorro-antd'
const data: any = require('./data.json')

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  activeIndex = 0
  loadspin: boolean = false
  dialogs = data
  name = this.dialogs[this.activeIndex].name
  position = this.dialogs[this.activeIndex].position
  dialog = this.dialogs[this.activeIndex].dialog
  avatar = this.dialogs[this.activeIndex].avatar
  dialogid = 1
  activeKey = 0
  // printers = [];
  printer = ''
  template = ''
  isloading: boolean = false
  // printersettings: any;
  count = 0
  total_devices = 0
  checked_devices = 0
  available_servers = []
  create_server = 0
  system_type = 0
  clients = []
  action
  radioValue = 'A'
  isconnectedtoserver: boolean = false
  device_type: string = ''
  datasavetype = '1'
  constructor(
    public electronService: ElectronService,
    private auth: AuthService,
    private notification: NzNotificationService,
    private electronservice: ElectronService,
  ) {
    // this.count = 1;
    this.device_type = localStorage.getItem('device_type')
    console.log(this.device_type)
    this.datasavetype = localStorage.getItem('datasavetype')
  }

  printersettings = {}

  printers = [
    {
      name: 'OneNote for Windows 10',
      displayName: 'OneNote for Windows 10',
      description: '',
      status: 0,
      isDefault: false,
      options: {
        'printer-location': '',
        'printer-make-and-model': 'Microsoft Software Printer Driver',
        system_driverinfo:
          'Microsoft Software Printer Driver;10.0.19041.630 (WinBuild.160101.0800);Microsoft® Windows® Operating System;10.0.19041.630',
      },
    },
    {
      name: 'Microsoft XPS Document Writer',
      displayName: 'Microsoft XPS Document Writer',
      description: '',
      status: 0,
      isDefault: false,
      options: {
        'printer-location': '',
        'printer-make-and-model': 'Microsoft XPS Document Writer v4',
        system_driverinfo:
          'Microsoft XPS Document Writer v4;10.0.19041.630 (WinBuild.160101.0800);Microsoft® Windows® Operating System;10.0.19041.630',
      },
    },
    {
      name: 'Microsoft Print to PDF',
      displayName: 'Microsoft Print to PDF',
      description: '',
      status: 0,
      isDefault: false,
      options: {
        'printer-location': '',
        'printer-make-and-model': 'Microsoft Print To PDF',
        system_driverinfo:
          'Microsoft Print To PDF;10.0.19041.630 (WinBuild.160101.0800);Microsoft® Windows® Operating System;10.0.19041.630',
      },
    },
    {
      name: 'HP LaserJet Pro MFP M126nw',
      displayName: 'HP LaserJet Pro MFP M126nw',
      description: '',
      status: 0,
      isDefault: false,
      options: {
        'printer-location':
          'http://[fe80::5eea:1dff:fe36:c39f%25]:3911/eb694e80-27c0-5229-e4ec-d7137e9dff98',
        'printer-make-and-model': 'Microsoft IPP Class Driver',
        system_driverinfo:
          'Microsoft IPP Class Driver;10.0.19041.630 (WinBuild.160101.0800);Microsoft® Windows® Operating System;10.0.19041.630',
      },
    },
    {
      name: 'Fax',
      displayName: 'Fax',
      description: '',
      status: 0,
      isDefault: false,
      options: {
        'printer-location': '',
        'printer-make-and-model': 'Microsoft Shared Fax Driver',
        system_driverinfo:
          'Microsoft Shared Fax Driver;10.0.19041.508 (WinBuild.160101.0800);Microsoft® Windows® Operating System;10.0.19041.508',
      },
    },
    {
      name: 'EPSON TM-T82 ReceiptSA4',
      displayName: 'EPSON TM-T82 ReceiptSA4',
      description: '',
      status: 128,
      isDefault: true,
      options: {
        'printer-location': '',
        'printer-make-and-model': 'EPSON TM-T82 ReceiptSA4',
        system_driverinfo:
          'EPSON TM-T82 ReceiptSA4;0, 3, 0, 0 built by: WinDDK;EPSON Advanced Printer Driver;1, 0, 19, 0',
      },
    },
  ]

  ngOnInit(): void {
    this.getprinters()
    this.getprintersetting()

    if (this.electronService.isElectronApp && this.device_type == 'server') {
      console.log(this.device_type)
      var server = this.electronService.remote.getGlobal('database')()
      server.on('appstarted', data => {
        console.log(data)
        this.server = data
        localStorage.setItem('serverip', this.server.address)
        localStorage.setItem('device_type', 'server')
        this.device_type = 'server'
        this.getclients()
        this.system_type = 2
      })
      server.emit('getserverip')
    }
    var serverip = localStorage.getItem('serverip')
    if (serverip && this.device_type == 'client') {
      this.checkifserver(serverip)
    }

    console.log(this.printers)
  }

  changeDialog(index) {
    this.activeIndex = index
    this.name = this.dialogs[index].name
    this.position = this.dialogs[index].position
    this.dialogid = index + 1
  }

  getprinters() {
    if (this.electronservice.isElectronApp) {
      this.printers = this.electronservice.remote.getGlobal('GetPrinters')()
      console.log(JSON.stringify(this.printers))
    }
  }

  getprintersetting() {
    this.auth.getdbdata(['printersettings']).subscribe(data => {
      this.printersettings = data['printersettings'][0] ? data['printersettings'][0] : {}
      console.log(this.printersettings)
    })
  }

  saveprintersettings() {
    this.auth.updateprintersettings(this.printersettings).subscribe(data => {
      this.notification.success('Success', 'Printer settings saved')
      console.log(this.notification)
    })
  }

  // getPrintersettings() {
  //   this.printersettings = JSON.parse(localStorage.getItem("printersettings"));
  //   console.log(this.printersettings);
  // }

  print() {
    this.electronservice.remote.getGlobal('testPrint')(this.count, this.printer, this.template)
  }

  changeKey(key) {
    this.activeKey = key
  }

  scan() {
    this.isloading = true
    if (this.electronService.isElectronApp) {
      var scanner = this.electronService.remote.getGlobal('scanlan')()
      console.log(scanner)
      scanner.then(devices => {
        console.log(devices)
        this.total_devices = devices.length
        this.checked_devices = 0
        this.available_servers = []
        this.findserver(devices)
      })
    }
  }

  checkifserver(ip) {
    this.auth.checkifserver(ip).subscribe(
      data => {
        console.log(data)
      },
      error => {
        console.log(error)
      },
      () => {
        this.available_servers.push({ ip: ip })
        this.joinserver(ip)
      },
    )
  }

  findserver(devices) {
    devices.forEach(device => {
      this.auth.checkifserver(device.ip).subscribe(
        data => {
          console.log(data)
          this.checked_devices++
        },
        error => {
          console.log(error)
          this.checked_devices++
        },
        () => {
          console.log(device.ip)
          this.available_servers.push(device)
        },
      )
    })
  }
  server
  startserver() {
    this.loadspin = true
    var server = this.electronService.remote.getGlobal('database')()
    server.on('appstarted', data => {
      console.log(data)
      this.server = data
      localStorage.setItem('serverip', this.server.address)
      localStorage.setItem('device_type', 'server')
      this.device_type = 'server'
      this.getclients()
    })
    server.on('new_client', data => {
      console.log(data)
      this.getclients()
    })
    this.electronService.remote.getGlobal('startserver')()
  }
  getclients() {
    this.auth.getclientlist(this.server.address).subscribe(data => {
      console.log(data)
      this.clients = data['clients']
    })
  }
  joinserver(ip) {
    this.auth.joinserver(ip).subscribe(data => {
      console.log(data)
      localStorage.setItem('serverip', ip)
      localStorage.setItem('device_type', 'client')
      this.device_type = 'client'
      this.isconnectedtoserver = true
      this.available_servers.filter(x => x.ip == ip)[0].connected = true
    })
  }
  removeclient(id) {
    this.electronService.remote.getGlobal('removeclient')(id)
    this.getclients()
  }
  stopserver(msg) {
    this.electronService.remote.getGlobal('stopserver')()
    // this.getclients();
  }

  syncstorage() {
    localStorage.setItem('datasavetype', this.datasavetype)
    console.log(this.datasavetype)
  }
}
