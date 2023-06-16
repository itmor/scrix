import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  changed$ = new ReplaySubject(1);

  getValue(key: string): unknown | null {
    try {
      const value = window.localStorage.getItem(key);
      return value && JSON.parse(value);
    } catch (ignore) {
      return null;
    }
  }

  setValue(key: string, value: unknown): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      this.changed$.next({ key, value });
    } catch (ignore) {
      // do nothing
    }
  }

  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
      this.changed$.next({ key, value: null });
    } catch (ignore) {
      // do nothing
    }
  }

  clear(): void | null {
    try {
      window.localStorage.clear();
      this.changed$.next(null);
    } catch (ignore) {
      return null;
    }
  }
}
