import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';

import { ImageModel } from '../../models/generator-image.model';
import { HttpService } from '../../../shared/services/http.service';
import { tap } from 'rxjs';

@Component({
  selector: 'manager-image-resource-view',
  templateUrl: './image-resource-view.component.html',
  styleUrls: ['./image-resource-view.component.less'],
})
export class ImageResourceViewComponent implements OnInit {
  images: ImageModel[];

  isLoading: boolean;

  constructor(private route: ActivatedRoute, private httpService: HttpService) {}

  ngOnInit(): void {
    const imageResourceId = +this.route.snapshot.params['id'];

    this.isLoading = true;
    this.httpService
      .post('/generator/get_images', { imageResourceId })
      .pipe(tap(() => (this.isLoading = false)))
      .subscribe((data) => (this.images = data));
  }

  downloadImage(url: string) {
    this.httpService.get<Blob>(url, { responseType: 'blob' }).subscribe((response) => {
      saveAs(response, 'image.jpg');
    });
  }
}
