import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'alert-component',
  imports: [
    MatIcon,
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  public message!: string;

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>
  ) {}

  closeMe(): void {
    this.dialogRef.close();
  }
}
