import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as ai from '@/types/cloud/project/ai';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { NotebookHeader } from './NotebookHeader.component';
import {
  mockedNotebook,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook';

const runningNotebook: ai.notebook.Notebook = {
  ...mockedNotebook,
  status: {
    ...mockedNotebookStatus,
    state: ai.notebook.NotebookStateEnum.RUNNING,
  },
};

const stroppedNotebook: ai.notebook.Notebook = {
  ...mockedNotebook,
  status: {
    ...mockedNotebookStatus,
    state: ai.notebook.NotebookStateEnum.STOPPED,
  },
};
describe('Notebook Header component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders NotebookHeader and trigger stop modal', async () => {
    render(<NotebookHeader.Skeleton />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('notebook-header-skeleton')).toBeInTheDocument();
  });

  it('renders NotebookHeader and trigger stop modal', async () => {
    render(<NotebookHeader notebook={runningNotebook} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('notebook-header-container')).toBeInTheDocument();
    expect(screen.getByTestId('open-stop-modal-button')).toBeInTheDocument();
    expect(
      screen.queryByTestId('open-start-modal-button'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('open-stop-modal-button'));
    await waitFor(() => {
      expect(screen.getByTestId('stop-notebook-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('stop-notebook-cancel-button'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('stop-notebook-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('renders NotebookHeader and trigger start modal', async () => {
    render(<NotebookHeader notebook={stroppedNotebook} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('notebook-header-container')).toBeInTheDocument();
    expect(screen.getByTestId('open-start-modal-button')).toBeInTheDocument();
    expect(
      screen.queryByTestId('open-stop-modal-button'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('open-start-modal-button'));
    await waitFor(() => {
      expect(screen.getByTestId('start-notebook-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('start-notebook-cancel-button'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('start-notebook-modal'),
      ).not.toBeInTheDocument();
    });
  });
});
