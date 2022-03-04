import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConstantsService {
    @Output() globals = new EventEmitter();
    isloggedin: boolean = false;
    stores = [];
    companyid = 0;
    user = null;
    email = '';
    constructor() { }
    listener() {
        return this.globals;
    }
    emit(data) {
        this.globals.emit(data)
    }
}