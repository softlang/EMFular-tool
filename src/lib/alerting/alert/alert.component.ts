import { Component } from '@angular/core';
import {OverlayRef} from "@angular/cdk/overlay";

@Component({
  selector: 'alert-component',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  public message!: string;

  constructor(
      private readonly overlayRef: OverlayRef
  ) {}

  closeMe(): void {
    this.overlayRef.dispose();
  }
}
