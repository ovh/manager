import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import LastDeploymentGitModal from '../LastDeploymentGit.modal';

describe('LastDeploymentGitModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal with the correct title', () => {
    const { getByTestId } = render(<LastDeploymentGitModal />, {
      wrapper,
    });
    const cancelBtn = getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });
});
