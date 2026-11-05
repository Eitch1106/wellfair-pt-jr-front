import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ratingColor', standalone: true })
export class RatingColorPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 7.5) return '#4caf50';
    if (value >= 5)   return '#ff9800';
    return '#f44336';
  }
}
