import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import CdnCorsResourceSharingModal from '../CdnCorsResourceSharing.modal';

describe('CdnCorsResourceSharingModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should close modal on cancel', () => {
    const { getByTestId } = render(<CdnCorsResourceSharingModal />, { wrapper });

    const cancelBtn = getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });
});
