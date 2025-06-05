import { act, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import DeleteStorage from './DeleteStorage.page';
import {
  useDeleteVolume,
  useVolume,
  useVolumeSnapshot,
} from '@/api/hooks/useVolume';
import { renderWithMockedWrappers } from '@/__tests__/renderWithMockedWrappers';

const deleteVolume = vi.fn();

vi.mock('react-router-dom');
vi.mocked(useParams).mockReturnValue({ volumeId: 'testVolume' });

vi.mock('@/api/hooks/useVolume');

const mockedVolume = {
  data: {
    attachedTo: [],
  },
  isPending: false,
} as ReturnType<typeof useVolume>;

const mockedVolumePending = {
  data: {},
  isPending: true,
} as ReturnType<typeof useVolume>;

vi.mocked(useDeleteVolume).mockReturnValue({
  deleteVolume: deleteVolume as ReturnType<
    typeof useDeleteVolume
  >['deleteVolume'],
} as ReturnType<typeof useDeleteVolume>);

const mockedSnapshots = {
  data: [{ id: 'snapshot1', volumeId: 'testVolume' }],
  isPending: false,
} as ReturnType<typeof useVolumeSnapshot>;

const mockedSnapshotsEmpty = {
  data: [],
  isPending: false,
} as ReturnType<typeof useVolumeSnapshot>;

describe('DeleteStorage', () => {
  it('renders without crashing', () => {
    vi.mocked(useVolume).mockReturnValue(mockedVolume);
    vi.mocked(useVolumeSnapshot).mockReturnValue(mockedSnapshots);

    const { container } = renderWithMockedWrappers(<DeleteStorage />);
    expect(container).toBeTruthy();
  });

  it('renders spinner when isPending is true', () => {
    vi.mocked(useVolume).mockReturnValue(mockedVolumePending);
    vi.mocked(useVolumeSnapshot).mockReturnValue(mockedSnapshots);

    const { getByTestId } = renderWithMockedWrappers(<DeleteStorage />);
    expect(getByTestId('deleteStorage-spinner')).toBeInTheDocument();
  });

  it('renders DeleteConstraintWarningMessage when hasSnapshot or isAttached is true', () => {
    vi.mocked(useVolume).mockReturnValue(mockedVolume);
    vi.mocked(useVolumeSnapshot).mockReturnValue(mockedSnapshots);

    const { getByTestId } = renderWithMockedWrappers(<DeleteStorage />);
    expect(
      getByTestId('deleteConstraintWarningMessage-content'),
    ).toBeInTheDocument();
  });

  it('renders DeleteWarningMessage when canDelete is true', () => {
    vi.mocked(useVolume).mockReturnValue(mockedVolume);
    vi.mocked(useVolumeSnapshot).mockReturnValue(mockedSnapshotsEmpty);

    const { getByText } = renderWithMockedWrappers(<DeleteStorage />);
    expect(
      getByText('pci_projects_project_storages_blocks_block_delete_content'),
    ).toBeInTheDocument();
  });

  it('calls deleteVolume when delete button is clicked and canDelete is true', () => {
    vi.mocked(useVolume).mockReturnValue(
      mockedVolume as ReturnType<typeof useVolume>,
    );
    vi.mocked(useVolumeSnapshot).mockReturnValue(mockedSnapshotsEmpty);

    const { getByText } = renderWithMockedWrappers(<DeleteStorage />);
    act(() => {
      fireEvent.click(
        getByText(
          'pci_projects_project_storages_blocks_block_delete_submit_label',
        ),
      );
    });
    expect(deleteVolume).toHaveBeenCalled();
  });
});
