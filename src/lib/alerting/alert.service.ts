import { Injectable } from '@angular/core';
import {AlertComponent} from "./alert/alert.component";
import {ModalService} from "../modal/modal.service";
import {ModalInstance} from "../modal/modal-instance";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
      private readonly modalService: ModalService
  ) {}

  alert(msg: string): void {
    const modalInstance: ModalInstance<AlertComponent, void> = this.modalService.createModal<AlertComponent, void>(
        AlertComponent,
        {
          width: '20%',
          height: '30%',
          hasBackdrop: true,
          backdropClass: 'cdk-overlay-dark-backdrop',
          panelClass: 'alert-overlay'
        }
    );
    modalInstance.componentRef.instance.message = msg;
  }
}
