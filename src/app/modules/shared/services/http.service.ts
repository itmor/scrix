import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiHost = environment.apiHost;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  private request<T = any>(request: Observable<T>): Observable<T> {
    return request.pipe(
      catchError((err: HttpErrorResponse) => {
        this.showError(err);
        return throwError(err);
      }),
    );
  }

  get<T = any>(url: string, options = {}): Observable<T> {
    return this.request<T>(this.http.get<T>(this.transformUrl(url), options));
  }

  post<T = any>(url: string, body = {}, options = {}): Observable<T> {
    return this.request<T>(this.http.post<T>(this.transformUrl(url), body, options));
  }

  private transformUrl(url: string): string {
    const urlHostPattern = /^(https?:\/\/)?(www\.)?([-\w]+\.)+([a-z]{2,})(:\d+)?(\/.*)?$/;
    if (!urlHostPattern.test(url)) {
      return `${this.apiHost}${url}`;
    }

    return url;
  }

  private showError(err: HttpErrorResponse): void {
    let message = err.error?.message || err.message;
    if (message !== null && typeof message === 'object') {
      message = JSON.stringify(message);
    }
    this.snackBar.open(message, 'OK', { duration: 2000 });
  }
}
