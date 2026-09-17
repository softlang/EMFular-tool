import {Observable} from 'rxjs';
import {ComponentRef} from "@angular/core";

export interface ModalRef<T, R = void> {
    componentRef: ComponentRef<T>;
    close(result?: R): void;
    closed: Observable<R | undefined>;
}