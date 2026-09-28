import {Subject} from 'rxjs';
import {OverlayRef} from "@angular/cdk/overlay";

export class ModalRef<R = void> {

    private readonly closedSubject = new Subject<R>();
    readonly closed = this.closedSubject.asObservable();

    constructor(
        private readonly overlayRef: OverlayRef
    ) {}

    close(result?: R): void {
        if (!this.overlayRef.hasAttached()) {
            return;
        }
        this.overlayRef.dispose();
        if (result) {
            this.closedSubject.next(result);
        }
        this.closedSubject.complete();
    }
}