import {ModalRef} from "./modal-ref";
import {ComponentRef} from "@angular/core";

export interface ModalInstance<T, R = void> {
    readonly ref: ModalRef<R>;
    readonly componentRef: ComponentRef<T>;
}