import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import DeleteSiteModal from '../DeleteSite.modal';

describe('DeleteSiteModal', () => {
  it('should render correctly', () => {
    const { container } = render(<DeleteSiteModal />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should close modal on cancel', () => {
    render(<DeleteSiteModal />, { wrapper });

    const cancelBtn = screen.getByTestId('secondary-button');
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
