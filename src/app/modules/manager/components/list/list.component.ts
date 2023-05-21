import { Component, OnInit } from '@angular/core';

import { HttpService } from '../../../shared/services/http.service';
import { ImageResourceModel } from '../../models/generator-image.model';

import { tap } from 'rxjs';

@Component({
  selector: 'manager-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit {
  imageResources: ImageResourceModel[];

  isLoading: boolean;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.httpService
      .post('/generator/load')
      .pipe(tap(() => (this.isLoading = false)))
      .subscribe((data) => (this.imageResources = data));
  }

  getPercentProgress(amount: number, currentCount: number): string {
    return `${(currentCount / amount) * 100}%`;
  }
}
