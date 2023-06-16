import { Component, OnInit, HostListener } from '@angular/core';
import { animate, sequence, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';

import { HttpService } from '../../../shared/services/http.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { ImageModel } from '../../models/generator-image.model';
import { pipe } from 'rxjs';

interface SampleData {
  originalLink: string;
}

@Component({
  selector: 'manager-image-resource-view',
  templateUrl: './image-resource-view.component.html',
  styleUrls: ['./image-resource-view.component.less'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0px', visibility: 'hidden' }),
        sequence([animate('.5s ease', style({ height: '*', visibility: 'visible' }))]),
      ]),
      transition(':leave', [
        sequence([animate('.5s ease', style({ height: '0px' })), style({ visibility: 'hidden' })]),
      ]),
    ]),
  ],
})
export class ImageResourceViewComponent implements OnInit {
  images: ImageModel[] = [];
  currentIndex: number = 0;
  sampleData: SampleData[] = [];
  key: string = '';
  lastImageOpenedKey: string;
  lastOpenedImageUrl: string;

  isLoading: boolean;
  isDownloading: boolean;
  isSamplesContentShown: boolean;
  isResourceImageOpened: boolean;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private httpService: HttpService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    const imageResourceId = +this.route.snapshot.params['id'];
    this.key = 'sample' + imageResourceId;
    this.lastImageOpenedKey = `${this.key}_last_opened_image_url`;
    this.initSample();

    this.isLoading = true;
    this.httpService
      .post('/generator/get_images', { imageResourceId })
      .pipe(tap(() => (this.isLoading = false)))
      .subscribe((data: ImageModel[]) => {
        this.images = data;
        this.currentIndex = 0;
      });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isResourceImageOpened) {
      return;
    }

    const { key } = event;
    if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowUp') {
      event.preventDefault();
    }
    if (key === 'ArrowRight') {
      this.nextImage();
    } else if (key === 'ArrowLeft') {
      this.prevImage();
    } else if (key === 'ArrowUp' && !this.isInSample(this.images[this.currentIndex].originalLink)) {
      this.snackBar.open('Изображение добавлено в выборку', 'OK', { duration: 2000 });
      this.addImage(this.images[this.currentIndex].originalLink);
    }
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.openDialog(this.images[this.currentIndex].originalLink, true);
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.openDialog(this.images[this.currentIndex].originalLink, true);
  }

  private initSample(): void {
    this.sampleData = this.getSampleData();

    this.lastOpenedImageUrl = this.localStorageService.getValue(this.lastImageOpenedKey) as string;

    if (!this.sampleData) {
      this.localStorageService.setValue(this.key, []);
    }

    this.localStorageService.changed$.subscribe((data: { key: string; value: unknown }) => {
      if (data.key === this.key) {
        this.sampleData = data.value as SampleData[];
      } else if (data.key === this.lastImageOpenedKey) {
        this.lastOpenedImageUrl = data.value as string;
      }
    });
  }

  private getSampleData(): SampleData[] {
    return this.localStorageService.getValue(this.key) as SampleData[];
  }

  addImage(originalLink: string): void {
    if (this.getSampleData().some((data) => data.originalLink === originalLink)) {
      return;
    }

    const data = [...this.getSampleData()];
    data.push({ originalLink });
    this.localStorageService.setValue(this.key, data);
  }

  removeImage(originalLink: string): void {
    this.localStorageService.setValue(
      this.key,
      this.getSampleData().filter((data) => data.originalLink !== originalLink) || [],
    );
  }

  setOpenedImageUrl(originalLink?: string): void {
    this.localStorageService.setValue(this.lastImageOpenedKey, originalLink);
  }

  isInSample(originalLink: string): boolean {
    return this.getSampleData().some((data) => data.originalLink === originalLink);
  }

  downloadImage(url: string): void {
    this.httpService
      .getBlob('/generator/download_file', { params: { url } })
      .subscribe((data: Blob) => saveAs(data, `scrix_image_${new Date().getTime()}.png`));
  }

  downloadZip(): void {
    const data = this.getSampleData();
    if (!data.length) {
      return;
    }

    this.isDownloading = true;
    this.httpService
      .post('/generator/download_images', {
        urls: this.getSampleData().map((data) => data.originalLink),
      })
      .pipe(tap(() => (this.isDownloading = false)))
      .subscribe((data: { zipFile: string }) => saveAs(data.zipFile, `scrix_sample_${new Date().getTime()}.zip`));
  }

  openDialog(imageUrl: string, isResource?: boolean): void {
    if (isResource) {
      this.isResourceImageOpened = true;
      this.setOpenedImageUrl(imageUrl);
    } else {
      this.isResourceImageOpened = false;
    }

    this.dialog.closeAll();
    this.dialog.open(ImageDialogComponent, {
      data: isResource
        ? {
            imageUrl,
            position: this.currentIndex,
            amount: this.imagesCount,
          }
        : {
            imageUrl,
          },
    });
  }

  toggleSamplesContent(): void {
    this.isSamplesContentShown = !this.isSamplesContentShown;
  }

  get sampleCount(): number {
    return this.getSampleData().length;
  }

  get imagesCount(): number {
    return this.images.length;
  }
}
