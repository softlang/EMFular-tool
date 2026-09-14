import { ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { describe, expect, it, vi } from 'vitest';

import { AlertService } from './alert.service';
import { AlertComponent } from './alert/alert.component';

describe('AlertService', () => {

  function createOverlayRef() {
    return {
      attach: vi.fn(() => ({
        instance: {} as AlertComponent
      } as ComponentRef<AlertComponent>)),
      backdropClick: vi.fn(() => ({
        subscribe: vi.fn()
      })),
      dispose: vi.fn()
    } as unknown as OverlayRef;
  }

  it('creates an alert', () => {
    const overlayRef = createOverlayRef();
    const overlay = {
      create: vi.fn(() => overlayRef)
    } as unknown as Overlay;

    const service = new AlertService(overlay);

    service.alert('Hello');

    expect(overlay.create).toHaveBeenCalledTimes(1);
    expect(overlayRef.attach).toHaveBeenCalledTimes(1);
    expect(overlayRef.attach.mock.results[0].value.instance.message)
        .toBe('Hello');
  });

  it('creates a separate overlay for each alert', () => {
    const firstRef = createOverlayRef();
    const secondRef = createOverlayRef();

    const overlay = {
      create: vi.fn()
          .mockReturnValueOnce(firstRef)
          .mockReturnValueOnce(secondRef)
    } as unknown as Overlay;

    const service = new AlertService(overlay);

    service.alert('First');
    service.alert('Second');

    expect(overlay.create).toHaveBeenCalledTimes(2);
    expect(firstRef.attach).toHaveBeenCalledTimes(1);
    expect(secondRef.attach).toHaveBeenCalledTimes(1);
    expect(firstRef).not.toBe(secondRef);
  });
});