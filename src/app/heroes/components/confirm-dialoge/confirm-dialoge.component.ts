import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-confirm-dialoge',
  templateUrl: './confirm-dialoge.component.html',
  styles: [
  ]
})
export class ConfirmDialogeComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Hero,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }



}
