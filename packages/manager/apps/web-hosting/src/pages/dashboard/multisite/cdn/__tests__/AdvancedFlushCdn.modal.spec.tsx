import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { getDomRect, navigate } from '@/utils/test.setup';

import AdvancedFlushCdnModal from '../AdvancedFlushCdn.modal';

describe('AdvancedFlushCdnModal', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should close modal on cancel', () => {
    const { getByTestId } = render(<AdvancedFlushCdnModal />, { wrapper });

    const cancelBtn = getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });

  it('validate and open upgrade cdn page and close modal', () => {
    const { getByTestId } = render(<AdvancedFlushCdnModal />, { wrapper });
    const primaryBtn = getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    expect(window.location.href).toBe('http://localhost:3000/');
  });
});
