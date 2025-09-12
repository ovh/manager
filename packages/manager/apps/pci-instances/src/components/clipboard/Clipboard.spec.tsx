import { describe, expect } from 'vitest';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Clipboard } from './Clipboard.component';

const mockWriteText = vi.fn();

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  configurable: true,
});

describe('Considering the GoBack component', () => {
  it('should display the value', () => {
    const value = 'value to copy';

    const { getByDisplayValue } = render(<Clipboard value={value} />);

    expect(getByDisplayValue(value)).toBeVisible();
  });

  it('should copy the value when clicking the button', async () => {
    const value = 'value to copy';

    const { getByRole } = render(<Clipboard value={value} />);

    await act(async () => {
      await userEvent.click(getByRole('button'));
    });
    expect(mockWriteText).toHaveBeenCalledWith(value);
  });
});
