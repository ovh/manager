import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';
import Notebooks from './Notebooks.page';

const mockedUsedNavigate = vi.fn();
describe('Notebooks List page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

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
          environment: {
            getEnvironment: vi.fn(() => ({
              getUser: vi.fn(() => mockedUser),
            })),
          },
        })),
      };
    });

    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: { children: React.ReactNode }) => children,
    }));

    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebooks: vi.fn(() => [mockedNotebook]),
      startNotebook: vi.fn((notebook) => notebook),
      stopNotebook: vi.fn((notebook) => notebook),
      deleteNotebook: vi.fn(),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });
  });

  it('should display Notebooks pages and skeleton', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByTestId('notebook-list-table-skeleton'),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('guide-skeleton')).toBeInTheDocument();
    });
  });

  it('should display notebooks list table and add button', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('create-notebook-button')).toBeInTheDocument();
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
      expect(screen.getByText(mockedNotebook.spec.name)).toBeInTheDocument();
    });
  });
});

describe('Action table button', () => {
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('notebooks-action-trigger');
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
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open start notebook modal', async () => {
    await openButtonInMenu('notebook-action-start-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./start/notebookId');
    });
  });

  it('open stop notebook modal', async () => {
    await openButtonInMenu('notebook-action-stop-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./stop/notebookId');
    });
  });

  it('open delete notebook Modal', async () => {
    await openButtonInMenu('notebook-action-delete-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/notebookId');
    });
  });

  it('go to manage notebook', async () => {
    await openButtonInMenu('notebook-action-manage-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./notebookId');
    });
  });
});
