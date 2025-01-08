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
import Configurations from './Configuration.component';
import {
  mockedNotebook,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook';
import { useToast } from '@/components/ui/use-toast';

const mockedUsedNavigate = vi.fn();
describe('Configuration component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: {
          ...mockedNotebook,
          status: {
            ...mockedNotebookStatus,
            state: ai.notebook.NotebookStateEnum.STOPPED,
          },
        },
        serviceQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
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

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Configuration', async () => {
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('configuration-container')).toBeInTheDocument();
  });

  it('renders and trigger copy Id in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('dashboard-copy-id-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedNotebook.id,
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookIdCopyToast',
      });
    });
  });

  it('open delete notebook modal', async () => {
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByTestId('notebook-config-delete-button'),
    ).not.toBeDisabled();
    act(() => {
      fireEvent.click(screen.getByTestId('notebook-config-delete-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete');
    });
  });
});
