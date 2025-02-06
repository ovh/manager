import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';
import Notebooks from './Notebooks.page';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

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

  it('open start notebook modal from action table button', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'notebooks-action-trigger',
      'notebook-action-start-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./start/notebookId');
  });

  it('open stop notebook modal from action table button', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'notebooks-action-trigger',
      'notebook-action-stop-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./stop/notebookId');
  });

  it('open delete notebook Modal from action table button', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'notebooks-action-trigger',
      'notebook-action-delete-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/notebookId');
  });

  it('go to manage notebook from action table button', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'notebooks-action-trigger',
      'notebook-action-manage-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./notebookId');
  });
});
