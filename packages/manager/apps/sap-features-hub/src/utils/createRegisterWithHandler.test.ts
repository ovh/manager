import { it, describe, expect, vi } from 'vitest';
import { createRegisterWithHandler } from './createRegisterWithHandler'; // Adjust the path as necessary

describe('createRegisterWithHandler', () => {
  it('should call customHandler and original onChange', () => {
    const mockBaseRegister = vi.fn().mockReturnValue({
      onChange: vi.fn(),
      name: 'testField',
      ref: vi.fn(),
    });

    const mockCustomHandler = vi.fn();

    const enhancedRegister = createRegisterWithHandler(
      mockBaseRegister,
      mockCustomHandler,
    );

    const options = enhancedRegister('testField');

    const mockEvent = {} as Event;

    options.onChange(mockEvent);

    expect(mockCustomHandler).toHaveBeenCalledWith(mockEvent);
    expect(mockBaseRegister().onChange).toHaveBeenCalledWith(mockEvent);
  });
});
