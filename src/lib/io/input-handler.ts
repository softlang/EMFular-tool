export class InputHandler {

  //helps with converting an event from a number input (!) into a number...
  // should be called on (input) while (ngModelChange) delivers the value immediately on $event
  static getNewValueFromEvent($event: Event): number {
    const input = $event.target as HTMLInputElement;
    return Number(input.value);
  }

  // this needs to be called on all input elements to allow them to accept the same value twice
  static clearElem(event: Event) {
    let target = event.target as HTMLInputElement;
    target.value = ''
  }
}
