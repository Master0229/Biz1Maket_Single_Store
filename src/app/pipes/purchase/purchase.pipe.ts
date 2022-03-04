import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'purchase'
})
export class PurchasePipe implements PipeTransform {

  transform(orders: any[], receiveId: number): unknown {
    console.log(receiveId)
    if(!orders) return [];
    var filtersorders = orders.filter(x => x.receiveStatus == receiveId )
    return filtersorders;
  }

}
