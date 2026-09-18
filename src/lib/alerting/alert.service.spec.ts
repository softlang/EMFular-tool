import {describe, expect, it, vi} from 'vitest';

import {AlertService} from './alert.service';
import {AlertComponent} from './alert/alert.component';
import {ModalService} from '../modal/modal.service';
import {ModalInstance} from '../modal/modal-instance';
import {ModalRef} from '../modal/modal-ref';

describe('AlertService', () => {

  function createModalInstance(): ModalInstance<AlertComponent, void> {
    return {
      ref: {} as ModalRef<void>,
      componentRef: {
        instance: {} as AlertComponent
      } as any
    };
  }

  it('creates an alert with the given message', () => {
    const modalInstance = createModalInstance();
    const modalService = {
      createModal: vi.fn(() => modalInstance)
    } as unknown as ModalService;

    const service = new AlertService(modalService);
    service.alert('Hello');
    expect(modalService.createModal).toHaveBeenCalledWith(
        AlertComponent,
        {
          width: '20%',
          height: '30%',
          hasBackdrop: true,
          backdropClass: 'cdk-overlay-dark-backdrop',
          panelClass: 'alert-overlay'
        }
    );
    expect(modalInstance.componentRef.instance.message)
        .toBe('Hello');
  });

  it('creates a separate modal for each alert', () => {
    const first = createModalInstance();
    const second = createModalInstance();

    const modalService = {
      createModal: vi.fn()
          .mockReturnValueOnce(first)
          .mockReturnValueOnce(second)
    } as unknown as ModalService;

    const service = new AlertService(modalService);
    service.alert('First');
    service.alert('Second');

    expect(modalService.createModal).toHaveBeenCalledTimes(2);
    expect(first.componentRef.instance.message)
        .toBe('First');
    expect(second.componentRef.instance.message)
        .toBe('Second');
    expect(first).not.toBe(second);
  });

});