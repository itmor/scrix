import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

import { HttpService } from '../../../shared/services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'manager-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.less'],
})
export class GeneratorComponent implements OnInit {
  selectedFile: File;
  safeImageUrl: SafeResourceUrl;
  iterationControl: FormControl;

  inProcess: boolean;
  hasError: boolean;

  private base64data: string;

  constructor(
    private sanitizer: DomSanitizer,
    private routerService: Router,
    private snackBar: MatSnackBar,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.iterationControl = new FormControl(30);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {
      this.base64data = reader.result as string;

      this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.base64data);
    };

    reader.readAsDataURL(this.selectedFile);
  }

  submit() {
    this.inProcess = true;

    this.httpService
      .post('/generator/add_resource', {
        imageBase64: this.base64data.replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', ''),
        iterationAmount: this.iterationControl.value,
      })
      .pipe(
        tap(() => {
          this.inProcess = false;
          this.routerService.navigate(['/']);
          this.snackBar.open('Изображение успешно добавлено!', 'OK', { duration: 4000 });
        }),
        catchError((err) => {
          this.inProcess = false;
          return throwError(err);
        }),
      )
      .subscribe();
  }
}
