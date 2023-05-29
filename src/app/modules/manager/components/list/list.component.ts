import { Component, OnInit } from '@angular/core';

import { HttpService } from '../../../shared/services/http.service';
import { tap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { ImageDialogComponent } from '../image-dialog/image-dialog.component';

import { ImageResourceModel } from '../../models/generator-image.model';


@Component({
  selector: 'manager-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit {
  imageResources: ImageResourceModel[];

  isLoading: boolean;

  constructor(private dialog: MatDialog, private httpService: HttpService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.httpService
      .post('/generator/load')
      .pipe(tap(() => (this.isLoading = false)))
      .subscribe((data) => (this.imageResources = data));
  }

  removeResource(imageResourceId: number) {
    if (!confirm('Действидельно удалить?')) {
      return;
    }
    this.httpService
      .post('/generator/remove_resource', { imageResourceId })
      .pipe(tap(() => (this.isLoading = true)))
      .subscribe(() => this.load());
  }

  getPercentProgress(amount: number, currentCount: number): string {
    return `${(currentCount / amount) * 100}%`;
  }

  openDialog(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: {
        imageUrl,
      },
    });
  }
}
