import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import * as ai from '@/types/cloud/project/ai';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

import { mockedDatastoreVolume } from '@/__tests__/helpers/mocks/volume';
import Containers from './Containers.component';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

const mockedUsedNavigate = vi.fn();
const dataSync = vi.fn();
describe('Containers component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
      };
    });

    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
        })),
        useNavigation: () => ({
          getURL: vi.fn(
            (app: string, path: string) => `#mockedurl-${app}${path}`,
          ),
        }),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Containers components with disabled sync button', async () => {
    render(
      <Containers
        onDataSync={dataSync}
        status={ai.job.JobStateEnum.ERROR}
        volumes={[mockedDatastoreVolume]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    expect(
      screen.getByText(mockedDatastoreVolume.mountPath),
    ).toBeInTheDocument();
    expect(screen.getByTestId('general-data-sync-button')).toBeInTheDocument();
    expect(screen.getByTestId('general-data-sync-button')).toBeDisabled();
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
        status={ai.job.JobStateEnum.ERROR}
        volumes={[mockedDatastoreVolume]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(
        screen.getByText(mockedDatastoreVolume.mountPath),
      ).toBeInTheDocument();
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
        status={ai.job.JobStateEnum.RUNNING}
        volumes={[mockedDatastoreVolume]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.click(screen.getByTestId('general-data-sync-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./data-sync');
    });
  });
  it('open data sync modal', async () => {
    render(
      <Containers
        onDataSync={dataSync}
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
});
