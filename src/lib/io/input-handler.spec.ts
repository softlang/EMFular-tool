import { InputHandler } from './input-handler';
import { describe, expect, it } from 'vitest';

describe('InputHandler', () => {
  it('should create an instance', () => {
    expect(new InputHandler()).toBeTruthy();
  });

  it('gets a number from an input event', () => {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = '42';

    const event = { target: input } as unknown as Event;
    expect(InputHandler.getNewValueFromEvent(event)).toBe(42);
  });

  it('clears the input element', () => {
    const input = document.createElement('input');
    input.value = '42';
    const event = { target: input } as unknown as Event;

    InputHandler.clearElem(event);
    expect(input.value).toBe('');
  });
});
