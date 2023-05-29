import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.less'],
})
export class ImageDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      imageUrl: string;
    },
  ) {}

  ngOnInit(): void {}

  get imageUrl(): string {
    return this.data.imageUrl;
  }
}
