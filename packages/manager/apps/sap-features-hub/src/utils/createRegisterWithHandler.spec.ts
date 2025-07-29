import { it, describe, expect, vi } from 'vitest';
import { createRegisterWithHandler } from './createRegisterWithHandler'; // Adjust the path as necessary

describe('createRegisterWithHandler', () => {
  it('should call customHandler and original onChange', () => {
    const mockCustomHandler = vi.fn();

    const mockBaseRegister = vi.fn();

    const enhancedRegister = createRegisterWithHandler(
      mockBaseRegister,
      mockCustomHandler,
    );

    expect(mockBaseRegister).not.toHaveBeenCalled();

    enhancedRegister('testField');

    expect(mockBaseRegister).not.toHaveBeenCalledWith(
      'testField',
      mockCustomHandler,
    );
  });
});
