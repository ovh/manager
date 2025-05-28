import { act, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import {
  OdsSelectValueChangeEventDetail,
  OsdsSelect,
} from '@ovhcloud/ods-components';
import DetachStorage from '@/pages/detach/DetachStorage.page';
import {
  useDetachVolume,
  useVolume,
  UseVolumeResult,
} from '@/api/hooks/useVolume';
import { useAttachedInstances } from '@/api/hooks/useInstance';
import { TAttachedInstance } from '@/api/select/instances';
import { renderWithMockedWrappers } from '@/__tests__/renderWithMockedWrappers';

vi.mock('@/api/hooks/useVolume', () => ({
  useVolume: vi
    .fn()
    .mockReturnValue({ data: { attachedTo: [] }, isPending: false }),
  useDetachVolume: vi
    .fn()
    .mockReturnValue({ isPending: false, detachVolume: vi.fn() }),
}));

vi.mock('react-router-dom');

vi.mock('@/hooks/useSearchFormParams');

vi.mock('@/api/hooks/useInstance');

afterEach(() => {
  vi.clearAllMocks();
});

describe('DetachStorage', () => {
  it('renders spinner when data is pending', () => {
    vi.mocked(useAttachedInstances).mockReturnValue({
      isPending: true,
    } as UseQueryResult<TAttachedInstance[]>);
    vi.mocked(useVolume).mockReturnValue({
      isPending: true,
    } as UseQueryResult<UseVolumeResult>);

    const { getByTestId } = renderWithMockedWrappers(<DetachStorage />);
    expect(getByTestId('detachStorage-spinner')).toBeInTheDocument();
  });

  it('renders volume and instance names when data is available', async () => {
    vi.mocked(useAttachedInstances).mockReturnValue({
      isPending: false,
      data: [{ id: 'Instance 1', name: 'Instance 1' }],
    } as UseQueryResult<TAttachedInstance[]>);
    vi.mocked(useVolume).mockReturnValue({
      data: { name: 'Volume 1', attachedTo: ['Instance 1'] },
      isPending: false,
    } as UseQueryResult<UseVolumeResult>);

    const { getByText } = renderWithMockedWrappers(<DetachStorage />);
    await waitFor(() => {
      expect(
        getByText(
          'pci_projects_project_storages_blocks_block_detach_detachvolume',
        ),
      ).toBeInTheDocument();
    });
  });

  it('renders instances when multiple are available', async () => {
    vi.mocked(useAttachedInstances).mockReturnValue({
      isPending: false,
      data: [
        { id: 'i1', name: 'Instance 1' },
        { id: 'i2', name: 'Instance 2' },
      ],
    } as UseQueryResult<TAttachedInstance[]>);
    vi.mocked(useVolume).mockReturnValue({
      data: { name: 'Volume 1', attachedTo: ['i1', 'i2'] },
      isPending: false,
    } as ReturnType<typeof useVolume>);

    const { queryByText, getByText, getByTestId } = renderWithMockedWrappers(
      <DetachStorage />,
    );
    expect(
      queryByText(
        'pci_projects_project_storages_blocks_block_detach_detachvolume',
      ),
    ).not.toBeInTheDocument();

    const select = (getByTestId(
      'detachStorage-select-instance',
    ) as unknown) as OsdsSelect;
    expect(select).toBeInTheDocument();

    const button = getByText(
      'pci_projects_project_storages_blocks_block_detach_submit_label',
    );
    expect(button).toBeDisabled();

    act(() => {
      select.odsValueChange.emit({
        value: 'i2',
      } as OdsSelectValueChangeEventDetail);
    });

    await waitFor(() => {
      expect(
        getByText(
          'pci_projects_project_storages_blocks_block_detach_detachvolume',
        ),
      ).toBeInTheDocument();

      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(
        vi.mocked(useDetachVolume().detachVolume),
      ).toHaveBeenLastCalledWith(expect.objectContaining({ instanceId: 'i2' }));
    });
  });
});
