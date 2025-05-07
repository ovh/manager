import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedDatastoreVolume } from '@/__tests__/helpers/mocks/volume/volume';
import Containers from './Containers.component';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import ai from '@/types/AI';

const dataSync = vi.fn();
const onDelete = vi.fn();
describe('Containers component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Containers components with disabled sync button', async () => {
    render(
      <Containers
        onDataSync={dataSync}
        updateMode={false}
        status={ai.job.JobStateEnum.ERROR}
        volumes={[mockedDatastoreVolume]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    expect(screen.getByText(mockedDatastoreVolume.mountPath)).toBeTruthy();
    expect(screen.getByTestId('general-data-sync-button')).toBeTruthy();
    expect(
      screen.getByTestId('general-data-sync-button').getAttribute('disabled'),
    ).not.toBeNull();
  });

  it('renders and trigger copy mountpath in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(
      <Containers
        onDataSync={dataSync}
        updateMode={false}
        status={ai.job.JobStateEnum.ERROR}
        volumes={[mockedDatastoreVolume]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByText(mockedDatastoreVolume.mountPath)).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('containers-copy-mountpath-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedDatastoreVolume.mountPath,
      );
    });
  });

  it('open data sync modal on button click', async () => {
    render(
      <Containers
        onDataSync={dataSync}
        updateMode={false}
        status={ai.job.JobStateEnum.RUNNING}
        volumes={[mockedDatastoreVolume]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.queryByTestId('add-volume-button')).toBeNull();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('general-data-sync-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./data-sync');
    });
  });

  it('open data sync modal on button click', async () => {
    render(
      <Containers
        onDataSync={dataSync}
        updateMode={true}
        status={ai.notebook.NotebookStateEnum.STOPPED}
        volumes={[mockedDatastoreVolume]}
        onDelete={onDelete}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.click(screen.getByTestId('add-volume-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add-container');
    });
  });

  it('open data sync modal', async () => {
    render(
      <Containers
        onDataSync={dataSync}
        updateMode={false}
        status={ai.job.JobStateEnum.RUNNING}
        volumes={[mockedDatastoreVolume]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await openButtonInMenu(
      'container-action-trigger',
      'container-action-data-sync-button',
    );
    await waitFor(() => {
      expect(dataSync).toHaveBeenCalledWith(mockedDatastoreVolume);
    });
  });

  it('open delete container modal', async () => {
    render(
      <Containers
        onDataSync={dataSync}
        updateMode={true}
        status={ai.job.JobStateEnum.RUNNING}
        volumes={[mockedDatastoreVolume]}
        onDelete={onDelete}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await openButtonInMenu(
      'container-action-trigger',
      'container-action-delete-button',
    );
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(mockedDatastoreVolume);
    });
  });
});
