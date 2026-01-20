import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import DetacheDomainModal from '../DetacheDomain.modal';

describe('DetacheDomainModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should close modal on cancel', () => {
    const { getByTestId } = render(<DetacheDomainModal />, { wrapper });

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const cancelBtn = getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });
});
