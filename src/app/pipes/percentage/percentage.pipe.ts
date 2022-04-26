import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(value: number, total: number): string {
    let result = ""
    if (total > 0) {
      result = ((value / total) * 100).toFixed(2) + " %"
    } else {
      result = "Invalid Data"
    }
    return result
  }

}
