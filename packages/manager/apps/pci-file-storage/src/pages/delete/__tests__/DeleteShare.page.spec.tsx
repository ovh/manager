import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useShare } from '@/data/hooks/shares/useShare';
import { useProjectId } from '@/hooks/useProjectId';
import { useShareParams } from '@/hooks/useShareParams';
import { useShareDeletion } from '@/pages/delete/hooks/useShareDeletion';
import type { TShareDeletionView } from '@/pages/delete/view-model/deleteShare.view-model';
import { urls } from '@/routes/Routes.constants';

import DeleteSharePage from '../DeleteShare.page';

const LIST_URL = urls.list.replace(':projectId', 'project-1');

const mockNavigate = vi.fn();
const mockMutate = vi.fn();

vi.mock('@/pages/delete/hooks/useShareDeletion', () => ({
  useShareDeletion: vi.fn(),
}));

const mockUseShareDeletion = vi.mocked(useShareDeletion);

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

vi.mock('@/hooks/useProjectId', () => ({
  useProjectId: vi.fn(),
}));

vi.mock('@/hooks/useShareParams', () => ({
  useShareParams: vi.fn(),
}));

const mockUseShare = vi.mocked(useShare);
const mockUseShareParams = vi.mocked(useShareParams);
const mockUseProjectId = vi.mocked(useProjectId);

const createShareDeletionView = (
  overrides: Partial<TShareDeletionView> = {},
): TShareDeletionView => ({
  shareName: 'My Share',
  canBeDeleted: true,
  ...overrides,
});

describe('DeleteSharePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseProjectId.mockReturnValue('project-1');
    mockUseShareParams.mockReturnValue({ region: 'GRA9', shareId: 'share-1' });
    mockUseShare.mockReturnValue({
      data: createShareDeletionView({ shareName: 'My Share', canBeDeleted: true }),
      isLoading: false,
    } as ReturnType<typeof useShare>);
    mockUseShareDeletion.mockReturnValue({
      deleteShare: mockMutate,
      isPending: false,
    });
  });

  it('should render modal with title and share name', () => {
    render(<DeleteSharePage />);

    expect(screen.getByText('delete:title')).toBeVisible();
    expect(screen.getByText('delete:description{"name":"My Share"}')).toBeVisible();
    expect(screen.getByText('delete:input.label')).toBeVisible();
  });

  it('should display error and keep submit button disabled when input is empty and touched', async () => {
    const user = userEvent.setup();
    render(<DeleteSharePage />);

    expect(screen.queryByText('delete:input.error')).toBeNull();
    expect(screen.getByRole('button', { name: 'delete:submitButton' })).toBeDisabled();

    const input = screen.getByRole('textbox');
    await user.type(input, 'truc');
    await user.clear(input);

    expect(screen.getByText('delete:input.error')).toBeVisible();
    expect(screen.getByRole('button', { name: 'delete:submitButton' })).toBeDisabled();
  });

  it('should enable submit button when user enters DELETE and share can be deleted', async () => {
    const user = userEvent.setup();
    render(<DeleteSharePage />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'DELETE');

    expect(screen.getByRole('button', { name: 'delete:submitButton' })).toBeEnabled();
  });

  it('should keep submit button disabled when share cannot be deleted', () => {
    mockUseShare.mockReturnValue({
      data: createShareDeletionView({ shareName: 'My Share', canBeDeleted: false }),
      isLoading: false,
    } as ReturnType<typeof useShare>);
    render(<DeleteSharePage />);

    expect(screen.getByRole('button', { name: 'delete:submitButton' })).toBeDisabled();
  });

  it('should display cannot-delete error message instead of form when share cannot be deleted', () => {
    mockUseShare.mockReturnValue({
      data: createShareDeletionView({ shareName: 'My Share', canBeDeleted: false }),
      isLoading: false,
    } as ReturnType<typeof useShare>);
    render(<DeleteSharePage />);

    expect(screen.getByText('delete:cannotDelete')).toBeVisible();
    expect(screen.queryByText('delete:input.label')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should not show error and keep button disabled when input is not DELETE', async () => {
    const user = userEvent.setup();
    render(<DeleteSharePage />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'other');

    expect(screen.queryByText('delete:input.error')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'delete:submitButton' })).toBeDisabled();
  });

  it('should navigate back when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<DeleteSharePage />);

    await user.click(screen.getByRole('button', { name: `${NAMESPACES.ACTIONS}:cancel` }));

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should call delete mutation when user confirms and clicks submit', async () => {
    const user = userEvent.setup();
    render(<DeleteSharePage />);

    await user.type(screen.getByRole('textbox'), 'DELETE');
    await user.click(screen.getByRole('button', { name: 'delete:submitButton' }));

    expect(mockMutate).toHaveBeenCalled();
  });

  it('should navigate to share list when delete mutation succeeds', async () => {
    let capturedOnSuccess: (() => void) | undefined;
    mockUseShareDeletion.mockImplementation((_projectId, _region, _shareId, { onSuccess }) => {
      capturedOnSuccess = onSuccess;
      return {
        deleteShare: () => {
          capturedOnSuccess?.();
        },
        isPending: false,
      };
    });
    const user = userEvent.setup();
    render(<DeleteSharePage />);

    await user.type(screen.getByRole('textbox'), 'DELETE');
    await user.click(screen.getByRole('button', { name: 'delete:submitButton' }));

    expect(mockNavigate).toHaveBeenCalledWith(LIST_URL);
  });

  it('should disable cancel and submit buttons when delete is pending', () => {
    mockUseShareDeletion.mockReturnValue({
      deleteShare: mockMutate,
      isPending: true,
    });
    render(<DeleteSharePage />);

    expect(screen.getByRole('button', { name: `${NAMESPACES.ACTIONS}:cancel` })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'delete:submitButton' })).toBeDisabled();
  });
});
