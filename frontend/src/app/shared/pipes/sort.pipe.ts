import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {
  transform(items: any[], field: string = 'name', direction: 'asc' | 'desc' = 'asc'): any[] {
    if (!items || !field) {
      return items;
    }

    return items.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
} 