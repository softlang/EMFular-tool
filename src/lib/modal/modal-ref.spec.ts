import {describe, expect, it, vi} from 'vitest';
import {OverlayRef} from '@angular/cdk/overlay';
import {ModalRef} from './modal-ref';

describe('ModalRef', () => {

    it('emits the result when closed', () => {
        const overlayRef = {
            hasAttached: vi.fn().mockReturnValue(true),
            dispose: vi.fn()
        } as unknown as OverlayRef;
        const ref = new ModalRef<string>(overlayRef);
        let result: string | undefined;
        ref.closed.subscribe(value => result = value);
        ref.close('hello');
        expect(result).toBe('hello');
    });


    it('emits a falsly result when closed', () => {
        const overlayRef = {
            hasAttached: vi.fn().mockReturnValue(true),
            dispose: vi.fn()
        } as unknown as OverlayRef;
        const ref = new ModalRef<boolean>(overlayRef);
        let result: boolean | undefined = undefined;
        ref.closed.subscribe(value => result = value);
        ref.close(false);
        expect(result).toBe(false);
    });
    it('emits nothing when closed without a result', () => {
        const overlayRef = {
            hasAttached: vi.fn().mockReturnValue(true),
            dispose: vi.fn()
        } as unknown as OverlayRef;
        const ref = new ModalRef<string>(overlayRef);
        let result: string | undefined = 'initial';
        ref.closed.subscribe(value => result = value);
        ref.close();
        expect(overlayRef.dispose).toHaveBeenCalledOnce();
        expect(result).toEqual('initial');
    });

    it('completes closed when closed', () => {
        const overlayRef = {
            hasAttached: vi.fn().mockReturnValue(true),
            dispose: vi.fn()
        } as unknown as OverlayRef;
        const ref = new ModalRef(overlayRef);
        let completed = false;
        ref.closed.subscribe({
            complete: () => completed = true
        });
        ref.close();
        expect(completed).toBe(true);
    });

    it('does nothing if the overlay is no longer attached', () => {
        const overlayRef = {
            hasAttached: vi.fn().mockReturnValue(false),
            dispose: vi.fn()
        } as unknown as OverlayRef;
        const ref = new ModalRef(overlayRef);
        let emitted = false;
        ref.closed.subscribe(() => emitted = true);
        ref.close();
        expect(overlayRef.dispose).not.toHaveBeenCalled();
        expect(emitted).toBe(false);
    });

    it('only closes once', () => {
        const overlayRef = {
            hasAttached: vi.fn().mockReturnValue(true),
            dispose: vi.fn()
        } as unknown as OverlayRef;
        // After dispose(), simulate the overlay no longer being attached.
        overlayRef.hasAttached
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false);
        const ref: ModalRef<string> = new ModalRef(overlayRef);
        ref.close('first');
        ref.close('second');
        expect(overlayRef.dispose).toHaveBeenCalledOnce();
    });

});