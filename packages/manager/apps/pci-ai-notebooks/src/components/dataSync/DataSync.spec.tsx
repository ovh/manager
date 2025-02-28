import { describe, it, expect, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedStatusVolume } from '@/__tests__/helpers/mocks/volume/volume';
import DataSyncModal from './DataSync.component';
import { handleSelectOption } from '@/__tests__/helpers/unitTestHelper';

const onSubmit = vi.fn();
describe('Data Sync Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Data Sync component', async () => {
    render(
      <DataSyncModal
        onSubmitSync={onSubmit}
        pending={true}
        volume={mockedStatusVolume}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    expect(
      screen.getByText('dataSyncMountPathAlertDescription'),
    ).toBeInTheDocument();
  });

  it('renders Data sync Component', async () => {
    render(<DataSyncModal onSubmitSync={onSubmit} pending={false} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    expect(
      screen.getByText('dataSyncGlobalAlertDescription'),
    ).toBeInTheDocument();
  });

  it('expect submit button to be disabled', async () => {
    render(<DataSyncModal onSubmitSync={onSubmit} pending={true} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('datasync-submit-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('datasync-submit-button')).toBeInTheDocument();
      expect(screen.getByTestId('datasync-submit-button')).toBeDisabled();
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<DataSyncModal onSubmitSync={onSubmit} pending={false} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    await handleSelectOption('select-datasync-trigger', 'push');

    act(() => {
      fireEvent.click(screen.getByTestId('datasync-submit-button'));
    });
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('push');
    });
  });
});
