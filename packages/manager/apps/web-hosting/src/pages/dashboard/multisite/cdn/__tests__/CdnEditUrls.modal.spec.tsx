import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import CdnEditUrlsModal from '../CdnEditUrls.modal';

describe('CdnEditUrlsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should close modal on cancel', () => {
    const { getByTestId } = render(<CdnEditUrlsModal />, { wrapper });
    const cancelBtn = getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });
});
