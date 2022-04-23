const path = require('path')
const moment = require('moment')
const installer = require('electron-installer-windows')
const { version } = require('./package.json')

const options = {
  name: 'Biz1Pos-BizDom',
  version: version,
  src: 'biz1pos-bizdom-win32-ia32/',
  dest: 'D:/Installers/',
  icon: path.join(__dirname, 'fa.ico'),
  authors: ['BizDom Soltions Pvt Ltd.'],
  description: 'SuperMarket POS Billing Software',
  animation: path.resolve(__dirname, 'gif2.gif')
}

async function main(options) {
  var startstamp = new Date().getTime();
  console.log('Creating package (this may take a while)')
  console.log(`started @ ${moment().format('lll')}`)
  try {
    await installer(options)
    console.log(`Successfully created package at ${options.dest}`)
    console.log(`completed @ ${moment().format('lll')}`)
    console.log(`timetook ${(new Date().getTime() - startstamp) / (60000)} mins`)
  } catch (err) {
    console.error(err, err.stack)
    process.exit(1)
  }
}
main(options)
