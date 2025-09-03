import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { TVolume } from '@ovh-ux/manager-pci-common';
import { createWrapper, shellContext } from '@/wrapperRenders';
import CreateVolumePage from '@/pages/create-volume/CreateVolume.page';
import {
  TCreateVolumeFromBackupArguments,
  useVolume,
  TNewVolumeFromBackupData,
} from '@/data/hooks/useVolume';
import { useVolumeCatalog } from '@/data/hooks/useCatalog';
import { useRegionsQuota } from '@/data/hooks/useQuota';
import { useBackups } from '@/data/hooks/useVolumeBackup';
import {
  MOCK_CATALOG,
  MOCK_QUOTA,
  MOCKED_BACKUP,
  MOCKED_VOLUME,
} from '@/__tests__/mocks';

vi.mock('@/data/hooks/useCatalog', () => ({
  useVolumeCatalog: vi.fn(),
}));

vi.mock('@/data/hooks/useQuota', () => ({
  useRegionsQuota: vi.fn(),
}));

vi.mock('@/data/hooks/useVolume', () => ({
  useVolume: vi.fn(),
  useCreateVolumeFromBackup: vi.fn(
    ({ onSuccess }: TCreateVolumeFromBackupArguments) => ({
      isPending: false,
      createVolumeFromBackup: vi.fn((data: TNewVolumeFromBackupData) => {
        onSuccess((data as unknown) as TVolume);
      }),
    }),
  ),
}));

vi.mock('@/data/hooks/useVolumeBackup', () => ({
  useBackups: vi.fn(),
}));

describe('CreateVolumePage', () => {
  const setupMocks = ({ loading = false } = {}) => {
    vi.mocked(useVolumeCatalog).mockReturnValue({
      data: MOCK_CATALOG,
    } as ReturnType<typeof useVolumeCatalog>);
    vi.mocked(useRegionsQuota).mockReturnValue({
      data: MOCK_QUOTA,
    } as ReturnType<typeof useRegionsQuota>);
    vi.mocked(useVolume).mockReturnValue({
      data: loading ? undefined : MOCKED_VOLUME,
      isLoading: loading,
    } as ReturnType<typeof useVolume>);
    vi.mocked(useBackups).mockReturnValue({
      data: loading ? undefined : { data: [MOCKED_BACKUP] },
      isLoading: loading,
    } as ReturnType<typeof useBackups>);
  };

  beforeEach(() => {
    setupMocks({ loading: false });
  });

  it('should render loading state', () => {
    setupMocks({ loading: true });
    const { container, queryByText } = render(<CreateVolumePage />, {
      wrapper: createWrapper(),
    });

    const title = queryByText(
      'pci_projects_project_storages_snapshots_snapshot_create-volume_title',
    );
    const spinner = container.querySelector('ods-spinner');
    expect(title).toBeFalsy();
    expect(spinner).toBeVisible();
  });

  it('go back to listing page on cancellation', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    const { getByText } = render(<CreateVolumePage />, {
      wrapper: createWrapper(),
    });

    const cancelButton = getByText(
      'pci_projects_project_storages_blocks_block_volume-edit_cancel_label',
    );
    expect(cancelButton).toBeTruthy();
    act(() => fireEvent.click(cancelButton));
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('redirect to listing page after volume creation', async () => {
    const { container } = render(<CreateVolumePage />, {
      wrapper: createWrapper(),
    });

    const formElement = container.querySelector('form');
    act(() => fireEvent.submit(formElement as Element));

    await waitFor(() => {
      expect(shellContext?.shell?.navigation?.navigateTo).toHaveBeenCalledWith(
        'public-cloud',
        '#/pci/projects/project-id/storages/blocks',
        {},
      );
    });
  });
});
