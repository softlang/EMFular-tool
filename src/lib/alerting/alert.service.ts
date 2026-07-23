import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AlertComponent} from "./alert/alert.component";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  static instance: AlertService;
  constructor(
    private dialog: MatDialog,
  ) {
    AlertService.instance = this;
  }


  alert(msg: string) {
    const dialogRef = this.dialog.open(
      AlertComponent,
      {width: '20%', height: '30%'}
    )
    dialogRef.componentInstance.message = msg;
  }
}
