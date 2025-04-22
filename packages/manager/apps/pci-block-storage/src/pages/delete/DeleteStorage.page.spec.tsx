import { act, fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';
import DeleteStorage from './DeleteStorage.page';
import * as useVolumeModule from '@/api/hooks/useVolume';
import { TAPIVolume, TVolumeSnapshot } from '@/api/data/volume';
import { WithAttach } from '@/api/select/volume';
import { UseVolumeResult } from '@/api/hooks/useVolume';

type UseDeleteVolumeReturnType = UseMutationResult<
  never,
  Error,
  void,
  unknown
> & { deleteVolume: () => void };

const mockedReactRouterNavigation = vi.fn();
const deleteVolume = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => ({
    navigate: mockedReactRouterNavigation,
  }),
  useParams: () => ({
    projectId: 'testProject',
    volumeId: 'testVolume',
  }),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
describe('DeleteStorage', () => {
  it('renders without crashing', () => {
    const { container } = render(<DeleteStorage />, { wrapper });
    expect(container).toBeTruthy();
  });

  it('renders spinner when isPending is true', () => {
    vi.spyOn(useVolumeModule, 'useVolume').mockReturnValue({
      data: {},
      isPending: true,
    } as UseQueryResult<UseVolumeResult>);
    const { getByTestId } = render(<DeleteStorage />, { wrapper });
    expect(getByTestId('deleteStorage-spinner')).toBeInTheDocument();
  });

  it('renders DeleteConstraintWarningMessage when hasSnapshot or isAttached is true', () => {
    vi.spyOn(useVolumeModule, 'useVolume').mockReturnValue({
      data: {
        name: 'testVolume',
        attachedTo: ['testGateway'],
      },
      isPending: false,
    } as UseQueryResult<UseVolumeResult>);
    vi.spyOn(useVolumeModule, 'useDeleteVolume').mockReturnValue(({
      deleteVolume: vi.fn(),
      isPending: false,
    } as unknown) as UseDeleteVolumeReturnType);
    vi.spyOn(useVolumeModule, 'useVolumeSnapshot').mockReturnValue({
      data: [{ id: 'snapshot1', volumeId: 'testVolume' }],
      isPending: false,
    } as UseQueryResult<TVolumeSnapshot[]>);

    const { getByTestId } = render(<DeleteStorage />, { wrapper });
    expect(
      getByTestId('deleteConstraintWarningMessage-content'),
    ).toBeInTheDocument();
  });

  it('renders DeleteWarningMessage when canDelete is true', () => {
    vi.spyOn(useVolumeModule, 'useVolume').mockReturnValue({
      data: { name: 'testVolume', attachedTo: [] }, // Empty array to make isAttached false
      isPending: false,
    } as UseQueryResult<UseVolumeResult>);
    vi.spyOn(useVolumeModule, 'useDeleteVolume').mockReturnValue(({
      deleteVolume: vi.fn(),
      isPending: false,
    } as unknown) as UseDeleteVolumeReturnType);
    vi.spyOn(useVolumeModule, 'useVolumeSnapshot').mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<TVolumeSnapshot[]>);
    const { getByText } = render(<DeleteStorage />, { wrapper });
    expect(
      getByText('pci_projects_project_storages_blocks_block_delete_content'),
    ).toBeInTheDocument();
  });

  it('calls deleteVolume when delete button is clicked and canDelete is true', () => {
    vi.spyOn(useVolumeModule, 'useDeleteVolume').mockReturnValue(({
      deleteVolume,
      isPending: false,
    } as unknown) as UseDeleteVolumeReturnType);
    const { getByTestId } = render(<DeleteStorage />, { wrapper });
    act(() => {
      fireEvent.click(getByTestId('deleteGateway-button_submit'));
    });
    expect(deleteVolume).toHaveBeenCalled();
  });
});
