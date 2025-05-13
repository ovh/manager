import { render, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as pciCommonModule from '@ovh-ux/manager-pci-common';
import { TInstance } from '@ovh-ux/manager-pci-common';
import DetachStorage from '@/pages/detach/DetachStorage.page';
import * as useVolumeModule from '@/api/hooks/useVolume';
import { TVolume } from '@/api/data/volume';

vi.mock('@/api/hooks/useVolume', () => ({
  useVolume: vi
    .fn()
    .mockReturnValue({ data: { attachedTo: [] }, isPending: false }),
  useDetachVolume: vi
    .fn()
    .mockReturnValue({ isPending: false, detachVolume: vi.fn() }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

describe('DetachStorage', () => {
  it('renders spinner when data is pending', () => {
    vi.mocked(useParams).mockReturnValue({ projectId: '1', volumeId: '1' });
    vi.spyOn(pciCommonModule, 'useInstance').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TInstance>);
    vi.spyOn(useVolumeModule, 'useVolume').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TVolume>);

    const { getByTestId } = render(<DetachStorage />);
    expect(getByTestId('detachStorage-spinner')).toBeInTheDocument();
  });

  it('renders volume and instance names when data is available', async () => {
    vi.spyOn(pciCommonModule, 'useInstance').mockReturnValue({
      data: { name: 'Instance 1' },
      isPending: false,
    } as UseQueryResult<TInstance>);
    vi.spyOn(useVolumeModule, 'useVolume').mockReturnValue({
      data: { name: 'Volume 1', attachedTo: ['Instance 1'] },
      isPending: false,
    } as UseQueryResult<TVolume>);

    const { getByText } = render(<DetachStorage />);
    await waitFor(() => {
      expect(
        getByText(
          'pci_projects_project_storages_blocks_block_detach_detachvolume',
        ),
      ).toBeInTheDocument();
    });
  });
});
