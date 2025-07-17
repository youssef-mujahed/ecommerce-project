import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, field: string = 'name'): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchText);
      }
      return false;
    });
  }
} 