import { Injectable } from '@angular/core';
import {AlertComponent} from "./alert/alert.component";
import {Overlay} from "@angular/cdk/overlay";
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  static instance: AlertService;
  constructor(
      private readonly overlay: Overlay
  ) {
    AlertService.instance = this;
  }

  alert(msg: string): void {
    const overlayRef = this.overlay.create({
      width: '20%',
      height: '30%',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'alert-overlay'
    });
    const componentRef = overlayRef.attach(
        new ComponentPortal(AlertComponent)
    );
    componentRef.instance.message = msg;

    overlayRef.backdropClick().subscribe(() => {
      overlayRef.dispose();
    });
  }
}
