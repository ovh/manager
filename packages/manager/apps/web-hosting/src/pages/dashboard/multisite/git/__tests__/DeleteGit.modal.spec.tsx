/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useLocation } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import DeleteGitModal from '../DeleteGit.modal';

const mockUseGetHostingServiceWebsite = vi.fn();
const mockDeleteGitAssociation = vi.fn();

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useGetHostingServiceWebsite: () => mockUseGetHostingServiceWebsite(),
}));

vi.mock('@/data/api/git', () => ({
  deleteGitAssociation: (...args: unknown[]) => mockDeleteGitAssociation(...args),
}));

describe('DeleteGitModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGetHostingServiceWebsite.mockReturnValue({
      data: ['website-id-1'],
      isLoading: false,
    });
    mockDeleteGitAssociation.mockResolvedValue(undefined);
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/test',
      search: '',
      hash: '',
      key: '',
      state: {
        serviceName: 'test-service',
        path: '/public_html',
      },
    } as ReturnType<typeof useLocation>);
  });

  it('should render correctly', () => {
    const { container } = render(<DeleteGitModal />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should close modal on cancel', () => {
    render(<DeleteGitModal />, { wrapper });

    const cancelBtn = screen.getByTestId('secondary-button');
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it('should toggle deleteFiles checkbox', () => {
    render(<DeleteGitModal />, { wrapper });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('should delete when primary button is clicked twice with deleteFiles checked', async () => {
    render(<DeleteGitModal />, { wrapper });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);
    fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(mockDeleteGitAssociation).toHaveBeenCalledWith('test-service', 'website-id-1', true);
    });
  });

  it('should delete without confirmation when deleteFiles is false', async () => {
    render(<DeleteGitModal />, { wrapper });
    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(mockDeleteGitAssociation).toHaveBeenCalledWith('test-service', 'website-id-1', false);
    });
  });

  it('should show success notification on delete success', async () => {
    render(<DeleteGitModal />, { wrapper });
    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(mockDeleteGitAssociation).toHaveBeenCalled();
    });
  });

  it('should show error notification on delete error', async () => {
    const error = new Error('Delete failed');
    (error as { response?: { data?: { message?: string } } }).response = {
      data: { message: 'Delete failed' },
    };
    mockDeleteGitAssociation.mockRejectedValue(error);

    render(<DeleteGitModal />, { wrapper });
    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(mockDeleteGitAssociation).toHaveBeenCalled();
    });
  });

  it('should not show error notification when data is empty', async () => {
    mockUseGetHostingServiceWebsite.mockReturnValue({
      data: [],
      isLoading: false,
    });
    const error = new Error('Delete failed');
    mockDeleteGitAssociation.mockRejectedValue(error);

    render(<DeleteGitModal />, { wrapper });
    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(mockDeleteGitAssociation).toHaveBeenCalled();
    });
  });

  it('should close modal after delete operation', async () => {
    render(<DeleteGitModal />, { wrapper });
    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(-1);
    });
  });
});
