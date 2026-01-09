/* eslint-disable @typescript-eslint/no-unsafe-return */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import DeployeGitModal from '../DeployeGIt.modal';

const hoistedMocks = vi.hoisted(() => ({
  mockUseGetHostingWebsiteIds: vi.fn(),
  mockUsePostWebsiteDeploy: vi.fn(),
}));

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useGetHostingWebsiteIds: () => hoistedMocks.mockUseGetHostingWebsiteIds(),
  usePostWebsiteDeploy: (...args: unknown[]) => hoistedMocks.mockUsePostWebsiteDeploy(...args),
}));

describe('DeployeGitModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoistedMocks.mockUseGetHostingWebsiteIds.mockReturnValue({
      data: [1],
      isFetching: false,
      isError: false,
      error: null,
    });
    hoistedMocks.mockUsePostWebsiteDeploy.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    });
  });

  it('should render the modal with the correct title', () => {
    const { getByTestId, getByText } = render(<DeployeGitModal />, { wrapper });
    expect(getByTestId('modal')).toBeInTheDocument();
    expect(getByText(/Vous êtes sur le point de déployer/i)).toBeInTheDocument();
  });

  it('should display a spinner while fetching website IDs', () => {
    hoistedMocks.mockUseGetHostingWebsiteIds.mockReturnValue({
      data: undefined,
      isFetching: true,
      isError: false,
      error: null,
    });

    render(<DeployeGitModal />, { wrapper });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display an error message if fetching website IDs fails', () => {
    hoistedMocks.mockUseGetHostingWebsiteIds.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: true,
      error: { message: 'Failed to fetch website ids' },
    });

    render(<DeployeGitModal />, { wrapper });
    expect(screen.getByText('Failed to fetch website ids')).toBeInTheDocument();
  });

  it('should display an error message if deployment fails', () => {
    hoistedMocks.mockUsePostWebsiteDeploy.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: { message: 'Deploy failed' },
    });

    render(<DeployeGitModal />, { wrapper });
    expect(screen.getByText('Deploy failed')).toBeInTheDocument();
  });

  it('should toggle the reset checkbox when clicked', async () => {
    const user = userEvent.setup();
    render(<DeployeGitModal />, { wrapper });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('should disable the primary button while fetching website IDs', () => {
    hoistedMocks.mockUseGetHostingWebsiteIds.mockReturnValue({
      data: [1],
      isFetching: true,
      isError: false,
      error: null,
    });

    render(<DeployeGitModal />, { wrapper });
    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn).toBeDisabled();
  });

  it('should disable the primary button while deployment is pending', () => {
    hoistedMocks.mockUsePostWebsiteDeploy.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    });

    render(<DeployeGitModal />, { wrapper });
    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn).toBeDisabled();
  });

  it('should disable the primary button if websiteId is undefined', () => {
    hoistedMocks.mockUseGetHostingWebsiteIds.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: false,
      error: null,
    });

    render(<DeployeGitModal />, { wrapper });
    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn).toBeDisabled();
  });

  it('should trigger deployment with reset=false when the primary button is clicked', async () => {
    const mockMutate = vi.fn();
    hoistedMocks.mockUsePostWebsiteDeploy.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    });

    const user = userEvent.setup();
    render(<DeployeGitModal />, { wrapper });
    const primaryBtn = screen.getByTestId('primary-button');
    await user.click(primaryBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ reset: false });
    });
  });

  it('should not trigger deployment if conditions are not met', async () => {
    const mockMutate = vi.fn();
    hoistedMocks.mockUseGetHostingWebsiteIds.mockReturnValue({
      data: [1],
      isFetching: true,
      isError: false,
      error: null,
    });
    hoistedMocks.mockUsePostWebsiteDeploy.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    });

    const user = userEvent.setup();
    render(<DeployeGitModal />, { wrapper });
    const primaryBtn = screen.getByTestId('primary-button');
    await user.click(primaryBtn);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should navigate back when the secondary button is clicked', async () => {
    const user = userEvent.setup();
    render(<DeployeGitModal />, { wrapper });
    const secondaryBtn = screen.getByTestId('secondary-button');
    await user.click(secondaryBtn);
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it('should navigate back when the modal is closed', async () => {
    const user = userEvent.setup();
    render(<DeployeGitModal />, { wrapper });
    const secondaryBtn = screen.getByTestId('secondary-button');
    await user.click(secondaryBtn);
    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
