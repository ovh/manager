import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedNotebook,
  mockedNotebookSpec,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook';
import { useToast } from '@/components/ui/use-toast';
import { mockedDatastoreVolume } from '@/__tests__/helpers/mocks/volume';
import Containers, { breadcrumb as Breadcrumb } from './Containers.page';

const mockedNotebookWithVol: ai.notebook.Notebook = {
  ...mockedNotebook,
  spec: {
    ...mockedNotebookSpec,
    volumes: [mockedDatastoreVolume],
  },
  status: {
    ...mockedNotebookStatus,
    state: ai.notebook.NotebookStateEnum.RUNNING,
    volumes: [
      {
        id: 'volumeId',
        mountPath: '/demo1',
        userVolumeId: 'userVolumeId',
      },
    ],
  },
};

const mockedUsedNavigate = vi.fn();
describe('Containers page', () => {
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

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: mockedNotebookWithVol,
        notebookQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
      })),
    }));

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
    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders Public Git page', async () => {
    render(<Containers />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByText(mockedDatastoreVolume.mountPath),
    ).toBeInTheDocument();
  });

  it('renders and trigger copy mountpath in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<Containers />, { wrapper: RouterWithQueryClientWrapper });
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
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'mountPathCopyToast',
      });
    });
  });

  it('open data sync modal on button click', async () => {
    render(<Containers />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('general-data-sync-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./data-sync');
    });
  });
});

describe('Action table button', () => {
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('container-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    const actionButton = screen.getByTestId(buttonId);
    await waitFor(() => {
      expect(actionButton).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(actionButton);
    });
  };
  beforeEach(async () => {
    render(<Containers />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedDatastoreVolume.mountPath),
      ).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open data sync modal', async () => {
    await openButtonInMenu('container-action-data-sync-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./data-sync/volumeId');
    });
  });
});
