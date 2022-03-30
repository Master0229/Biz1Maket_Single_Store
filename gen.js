const path = require('path')
const moment = require('moment')


const installer = require('electron-installer-windows')

const options = {
    src: './Biz1Pos-win32-ia32/Biz1Pos.exe',
    dest: './Installers',
    icon: path.join(__dirname, './256_Biz1pos.ico'),
    authors: ['BizDom Soltions Pvt Ltd.'],
    exe: 'Biz1POS-0.0.3.exe',
    description: 'SuperMarket POS Billing Software'
}

async function main(options) {
    var startstamp = new Date().getTime();
    console.log('Creating package (this may take a while)')
    console.log(`started @ ${moment().format('lll')}`)
    try {
        await installer(options)
        console.log(`Successfully created package at ${options.dest}`)
        console.log(`completed @ ${moment().format('lll')}`)
        console.log(`timetook ${(new Date().getTime() - startstamp)/(60000)} mins`)
    } catch (err) {
        console.error(err, err.stack)
        process.exit(1)
    }
}
main(options)
