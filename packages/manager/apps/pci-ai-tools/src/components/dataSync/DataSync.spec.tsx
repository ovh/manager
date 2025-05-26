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
    expect(screen.getByTestId('datasync-modal')).toBeTruthy();
    expect(screen.getByText('dataSyncMountPathAlertDescription')).toBeTruthy();
  });

  it('renders Data sync Component', async () => {
    render(<DataSyncModal onSubmitSync={onSubmit} pending={false} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('datasync-modal')).toBeTruthy();
    expect(screen.getByText('dataSyncGlobalAlertDescription')).toBeTruthy();
  });

  it('expect submit button to be disabled', async () => {
    render(<DataSyncModal onSubmitSync={onSubmit} pending={true} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('datasync-modal')).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId('datasync-submit-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('datasync-submit-button')).toBeTruthy();
      expect(
        screen.getByTestId('datasync-submit-button').getAttribute('disabled'),
      ).not.toBeNull();
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<DataSyncModal onSubmitSync={onSubmit} pending={false} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('datasync-modal')).toBeTruthy();
    await handleSelectOption('select-datasync-trigger', 'push');

    act(() => {
      fireEvent.click(screen.getByTestId('datasync-submit-button'));
    });
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('push');
    });
  });
});
