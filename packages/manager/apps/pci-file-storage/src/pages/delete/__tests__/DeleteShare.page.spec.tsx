import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useShare } from '@/data/hooks/shares/useShare';
import { useShareParams } from '@/hooks/useShareParams';
import type { TShareDetailsView } from '@/pages/dashboard/view-model/shareDetails.view-model';

import DeleteSharePage from '../DeleteShare.page';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/data/hooks/shares/useShare', () => ({
  useShare: vi.fn(),
}));

vi.mock('@/hooks/useShareParams', () => ({
  useShareParams: vi.fn(),
}));

const mockUseShare = vi.mocked(useShare);
const mockUseShareParams = vi.mocked(useShareParams);

const createShareDetails = (overrides: Partial<TShareDetailsView> = {}): TShareDetailsView =>
  ({
    id: 'share-1',
    name: 'My Share',
    region: 'GRA9',
    regionDisplayKey: 'regions:manager_components_region_GRA_micro',
    protocol: 'NFS',
    size: 100,
    status: 'available',
    statusDisplay: { labelKey: 'status:active', badgeColor: 'success' },
    createdAt: '2025-01-01',
    mountPaths: [],
    enabledActions: [],
    ...overrides,
  }) as TShareDetailsView;

describe('DeleteSharePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseShareParams.mockReturnValue({ region: 'GRA9', shareId: 'share-1' });
    mockUseShare.mockReturnValue({
      data: createShareDetails({ name: 'My Share' }),
      isLoading: false,
    } as ReturnType<typeof useShare>);
  });

  it('should render modal with title and share name', () => {
    render(<DeleteSharePage />);

    expect(screen.getByText('delete:title')).toBeVisible();
    expect(screen.getByText('delete:description{"name":"My Share"}')).toBeVisible();
    expect(screen.getByText('delete:confirmLabel')).toBeVisible();
  });

  it('should display error and keep submit button disabled when input is empty', () => {
    render(<DeleteSharePage />);

    expect(screen.getByText('delete:confirmEmptyError')).toBeVisible();
    expect(screen.getByRole('button', { name: 'delete:submitButton' })).toBeDisabled();
  });

  it('should enable submit button when user enters DELETE', async () => {
    const user = userEvent.setup();
    render(<DeleteSharePage />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'DELETE');

    expect(screen.getByRole('button', { name: 'delete:submitButton' })).toBeEnabled();
  });

  it('should not show error and keep button disabled when input is not DELETE', async () => {
    const user = userEvent.setup();
    render(<DeleteSharePage />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'other');

    expect(screen.queryByText('delete:confirmEmptyError')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'delete:submitButton' })).toBeDisabled();
  });

  it('should navigate back when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<DeleteSharePage />);

    await user.click(screen.getByRole('button', { name: `${NAMESPACES.ACTIONS}:cancel` }));

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });
});
