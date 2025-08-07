import { render, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ApiError } from '@ovh-ux/manager-core-api';
import * as reactRouterDom from 'react-router-dom';
import DeletePage from './Delete.page';
import {
  useVolumeSnapshot,
  useDeleteSnapshot,
  TDeleteProps,
} from '@/api/hooks/useSnapshots';
import { useNotifications } from '@/hooks/useNotifications';

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/api/hooks/useSnapshots', () => ({
  useVolumeSnapshot: vi.fn(),
  useDeleteSnapshot: vi.fn(),
}));

describe('DeletePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    const addSuccessMessage = vi.fn();
    const addErrorMessage = vi.fn();
    vi.mocked(useNotifications).mockReturnValue({
      addSuccessMessage,
      addErrorMessage,
    });
  });

  it('should render loading state', () => {
    // Mock loading state
    vi.mocked(useVolumeSnapshot).mockReturnValue({
      isPending: true,
      data: undefined,
    } as ReturnType<typeof useVolumeSnapshot>);

    vi.mocked(useDeleteSnapshot).mockReturnValue(({
      deleteSnapshot: vi.fn(),
      isPending: false,
    } as unknown) as ReturnType<typeof useDeleteSnapshot>);

    const { getByText, getByTestId } = render(<DeletePage />);

    expect(
      getByText(
        'pci_projects_project_storages_snapshots_snapshot_delete_title',
      ),
    ).toBeInTheDocument();
    // Buttons should be disabled in loading state
    const submitButton = getByTestId('pciModal-button_submit');
    expect(submitButton.getAttribute('is-disabled')).toBe('true');
  });

  it('should display snapshot name when data is loaded', () => {
    vi.mocked(useVolumeSnapshot).mockReturnValue({
      isPending: false,
      data: { name: 'Test Snapshot' },
    } as ReturnType<typeof useVolumeSnapshot>);

    vi.mocked(useDeleteSnapshot).mockReturnValue(({
      deleteSnapshot: vi.fn(),
      isPending: false,
    } as unknown) as ReturnType<typeof useDeleteSnapshot>);

    const { getByText } = render(<DeletePage />);

    // Content should include snapshot name after translation
    const content = getByText(
      /pci_projects_project_storages_snapshots_snapshot_delete_content/,
    );
    expect(content).toBeInTheDocument();
  });

  it('should navigate back when cancel button is clicked', () => {
    const mockNavigate = vi.fn();
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useVolumeSnapshot).mockReturnValue({
      isPending: false,
      data: { name: 'Test Snapshot' },
    } as ReturnType<typeof useVolumeSnapshot>);

    vi.mocked(useDeleteSnapshot).mockReturnValue(({
      deleteSnapshot: vi.fn(),
      isPending: false,
    } as unknown) as ReturnType<typeof useDeleteSnapshot>);

    const { getByTestId } = render(<DeletePage />);

    const cancelButton = getByTestId('pciModal-button_cancel');
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should call deleteSnapshot when confirm button is clicked', () => {
    vi.mocked(useVolumeSnapshot).mockReturnValue({
      isPending: false,
      data: { name: 'Test Snapshot' },
    } as ReturnType<typeof useVolumeSnapshot>);

    const deleteSnapshotMock = vi.fn();
    vi.mocked(useDeleteSnapshot).mockReturnValue(({
      deleteSnapshot: deleteSnapshotMock,
      isPending: false,
    } as unknown) as ReturnType<typeof useDeleteSnapshot>);

    const { getByTestId } = render(<DeletePage />);

    const confirmButton = getByTestId('pciModal-button_submit');
    fireEvent.click(confirmButton);

    expect(deleteSnapshotMock).toHaveBeenCalledWith('test-snapshot-id');
  });

  it('should show success notification and navigate back on successful deletion', () => {
    const mockNavigate = vi.fn();
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useVolumeSnapshot).mockReturnValue({
      isPending: false,
      data: { name: 'Test Snapshot' },
    } as ReturnType<typeof useVolumeSnapshot>);

    const addSuccessMessage = vi.fn();
    const addErrorMessage = vi.fn();
    vi.mocked(useNotifications).mockReturnValue({
      addSuccessMessage,
      addErrorMessage,
    });

    const deleteSnapshotMock = vi.fn();
    vi.mocked(useDeleteSnapshot).mockImplementation(
      ({ onSuccess }: TDeleteProps) =>
        (({
          deleteSnapshot: (id: string) => {
            deleteSnapshotMock(id);
            if (onSuccess) {
              onSuccess();
            }
          },
          isPending: false,
        } as unknown) as ReturnType<typeof useDeleteSnapshot>),
    );

    const { getByTestId } = render(<DeletePage />);

    const confirmButton = getByTestId('pciModal-button_submit');
    fireEvent.click(confirmButton);

    expect(deleteSnapshotMock).toHaveBeenCalledWith('test-snapshot-id');
    expect(addSuccessMessage).toHaveBeenCalledWith({
      i18nKey:
        'pci_projects_project_storages_snapshots_snapshot_delete_success_message',
      values: {
        snapshot: 'Test Snapshot',
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should show error notification and navigate back on deletion failure', () => {
    const mockNavigate = vi.fn();
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useVolumeSnapshot).mockReturnValue({
      isPending: false,
      data: { name: 'Test Snapshot' },
    } as ReturnType<typeof useVolumeSnapshot>);

    const addSuccessMessage = vi.fn();
    const addErrorMessage = vi.fn();
    vi.mocked(useNotifications).mockReturnValue({
      addSuccessMessage,
      addErrorMessage,
    });

    const mockError = new Error('Deletion failed') as ApiError;
    const deleteSnapshotMock = vi.fn();
    vi.mocked(useDeleteSnapshot).mockImplementation(
      ({ onError }: TDeleteProps) =>
        (({
          deleteSnapshot: (id: string) => {
            deleteSnapshotMock(id);
            if (onError) {
              onError(mockError);
            }
          },
          isPending: false,
        } as unknown) as ReturnType<typeof useDeleteSnapshot>),
    );

    const { getByTestId } = render(<DeletePage />);

    const confirmButton = getByTestId('pciModal-button_submit');
    fireEvent.click(confirmButton);

    expect(deleteSnapshotMock).toHaveBeenCalledWith('test-snapshot-id');
    expect(addErrorMessage).toHaveBeenCalledWith({
      i18nKey:
        'pci_projects_project_storages_snapshots_snapshot_delete_error_delete',
      error: mockError,
      values: {
        snapshot: 'Test Snapshot',
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should disable buttons when deletion is in progress', () => {
    vi.mocked(useVolumeSnapshot).mockReturnValue({
      isPending: false,
      data: { name: 'Test Snapshot' },
    } as ReturnType<typeof useVolumeSnapshot>);

    vi.mocked(useDeleteSnapshot).mockReturnValue(({
      deleteSnapshot: vi.fn(),
      isPending: true, // Deletion in progress
    } as unknown) as ReturnType<typeof useDeleteSnapshot>);

    const { getByTestId } = render(<DeletePage />);

    const confirmButton = getByTestId('pciModal-button_submit');
    expect(confirmButton.getAttribute('is-disabled')).toBe('true');
  });
});
