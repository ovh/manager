import { fireEvent, render, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getUserStoragePolicy, TUser } from '@/api/data/users';
import { usePostS3Secret } from '@/api/hooks/useUsers';
import { useNotifications } from '@/hooks/useNotifications';
import ActionsComponent from './Actions';

vi.mock('@/api/hooks/useUsers', () => ({
  usePostS3Secret: vi.fn(),
}));

vi.mock('@/api/data/users', () => ({
  getUserStoragePolicy: vi
    .fn()
    .mockImplementation(() => Promise.resolve({ policy: 'policy-content' })),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

describe('ActionsComponent', () => {
  const mockNavigate = vi.fn();
  const mockUser = {
    id: 123,
    username: 'test_user',
    access: 'read',
  } as TUser;

  const mockAddSuccessMessage = vi.fn();
  const mockAddErrorMessage = vi.fn();
  const showSecretKeyMock = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(usePostS3Secret).mockReturnValue(({
      postS3Secret: showSecretKeyMock,
    } as unknown) as ReturnType<typeof usePostS3Secret>);

    vi.mocked(useNotifications).mockReturnValue({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    });

    vi.clearAllMocks();
  });

  it('renders all menu items with correct labels', () => {
    const { container } = render(<ActionsComponent user={mockUser} />);

    const importPolicyButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_users_import_json"]',
    );
    const downloadPolicyButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_users_download_json"]',
    );
    const downloadRcloneButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_users_download_rclone_file"]',
    );
    const seeSecretKeyButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_users_see_secret_key"]',
    );
    const deleteButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_delete_label"]',
    );

    expect(importPolicyButton).toBeInTheDocument();
    expect(downloadPolicyButton).toBeInTheDocument();
    expect(downloadRcloneButton).toBeInTheDocument();
    expect(seeSecretKeyButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('should navigates to import policy page when clicking import JSON', () => {
    const { container } = render(<ActionsComponent user={mockUser} />);
    const importPolicyButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_users_import_json"]',
    );

    fireEvent.click(importPolicyButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      `./import-policy?userId=${mockUser.id}`,
    );
  });

  it('should calls getUserStoragePolicy and saveAs when clicking download JSON', async () => {
    const { container } = render(<ActionsComponent user={mockUser} />);
    const downloadPolicyButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_users_download_json"]',
    );

    fireEvent.click(downloadPolicyButton);

    expect(getUserStoragePolicy).toHaveBeenCalledWith(
      'project-id',
      mockUser.id,
    );
  });

  it('should navigates to rclone download page when clicking download rclone file', () => {
    const { container } = render(<ActionsComponent user={mockUser} />);
    const downloadRcloneButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_users_download_rclone_file"]',
    );

    fireEvent.click(downloadRcloneButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      `./rclone/download?userId=${mockUser.id}`,
    );
  });

  it('calls showSecretKey when clicking see secret key', () => {
    const { container } = render(<ActionsComponent user={mockUser} />);
    const seeSecretKeyButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_users_see_secret_key"]',
    );

    fireEvent.click(seeSecretKeyButton);

    expect(showSecretKeyMock).toHaveBeenCalled();
  });

  it('should handles successful showSecretKey response correctly', async () => {
    vi.mocked(usePostS3Secret).mockImplementation(
      ({ onSuccess }) =>
        ({
          postS3Secret: () => {
            showSecretKeyMock();
            onSuccess({ secret: 'secret' });
          },
          isPending: false,
        } as ReturnType<typeof usePostS3Secret>),
    );

    const { container } = render(<ActionsComponent user={mockUser} />);
    const seeSecretKeyButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_users_see_secret_key"]',
    );

    fireEvent.click(seeSecretKeyButton);

    await waitFor(() => {
      expect(showSecretKeyMock).toHaveBeenCalled();
    });
  });

  it('should handles error showSecretKey response correctly', async () => {
    vi.mocked(usePostS3Secret).mockImplementation(
      ({ onError }) =>
        ({
          postS3Secret: () => {
            showSecretKeyMock();
            onError(new Error('API Error') as ApiError);
          },
          isPending: false,
        } as ReturnType<typeof usePostS3Secret>),
    );

    const { container } = render(<ActionsComponent user={mockUser} />);
    const seeSecretKeyButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_users_see_secret_key"]',
    );

    fireEvent.click(seeSecretKeyButton);

    await waitFor(() => {
      expect(showSecretKeyMock).toHaveBeenCalled();
    });
  });

  it('should navigates to delete page when clicking delete', () => {
    const { container } = render(<ActionsComponent user={mockUser} />);
    const deleteButton = container.querySelector(
      'ods-button[label="pci_projects_project_storages_containers_delete_label"]',
    );

    fireEvent.click(deleteButton);

    expect(mockNavigate).toHaveBeenCalledWith(`./${mockUser.id}/delete`);
  });
});
