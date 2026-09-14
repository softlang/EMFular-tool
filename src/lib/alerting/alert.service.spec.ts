import { ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { describe, expect, it, vi } from 'vitest';

import { AlertService } from './alert.service';
import { AlertComponent } from './alert/alert.component';

describe('AlertService', () => {

  function createOverlayRef() {
    const componentRef = {
      instance: {} as AlertComponent
    } as ComponentRef<AlertComponent>;
    const overlayRef = {
      attach: vi.fn(() => componentRef),
      backdropClick: vi.fn(() => ({
        subscribe: vi.fn()
      })),
      dispose: vi.fn()
    } as unknown as OverlayRef;
    return { overlayRef, componentRef };
  }

  it('creates an alert', () => {
    const { overlayRef, componentRef } = createOverlayRef();
    const overlay = {
      create: vi.fn(() => overlayRef)
    } as unknown as Overlay;
    const service = new AlertService(overlay);

    service.alert('Hello');
    expect(overlay.create).toHaveBeenCalledTimes(1);
    expect(overlayRef.attach).toHaveBeenCalledTimes(1);
    expect(componentRef.instance.message).toBe('Hello');
  });

  it('creates a separate overlay for each alert', () => {
    const first = createOverlayRef();
    const second = createOverlayRef();
    const overlay = {
      create: vi.fn()
          .mockReturnValueOnce(first.overlayRef)
          .mockReturnValueOnce(second.overlayRef)
    } as unknown as Overlay;
    const service = new AlertService(overlay);

    service.alert('First');
    service.alert('Second');
    expect(overlay.create).toHaveBeenCalledTimes(2);
    expect(first.overlayRef.attach).toHaveBeenCalledTimes(1);
    expect(second.overlayRef.attach).toHaveBeenCalledTimes(1);
    expect(first.overlayRef).not.toBe(second.overlayRef);
    expect(first.componentRef.instance.message).toBe('First');
    expect(second.componentRef.instance.message).toBe('Second');
  });

  it('closes the alert when the backdrop is clicked', () => {
    const overlayRef = {
      attach: vi.fn(() => ({
        instance: {} as AlertComponent
      } as ComponentRef<AlertComponent>)),
      backdropClick: vi.fn(),
      dispose: vi.fn()
    } as unknown as OverlayRef;
    const overlay = {
      create: vi.fn(() => overlayRef)
    } as unknown as Overlay;
    let backdropClickHandler!: () => void;
    vi.mocked(overlayRef.backdropClick).mockReturnValue({
      subscribe: vi.fn((handler: () => void) => {
        backdropClickHandler = handler;
      })
    } as any);
    const service = new AlertService(overlay);

    service.alert('Hello');
    expect(overlayRef.dispose).not.toHaveBeenCalled();
    backdropClickHandler();
    expect(overlayRef.dispose).toHaveBeenCalledTimes(1);
  });
});