import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import NotebookLayout, {
  breadcrumb as Breadcrumb,
  Loader,
} from '@/pages/notebooks/[notebookId]/Notebook.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as notebookAPI from '@/data/api/ai/notebook/notebook.api';
import {
  mockedNotebook,
  mockedNotebookSpec,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import { mockedBackup } from '@/__tests__/helpers/mocks/notebook/backup';
import {
  mockedDatastoreVolume,
  mockedPublicGitVolume,
} from '@/__tests__/helpers/mocks/volume/volume';
import ai from '@/types/AI';

const loaderParam = {
  params: {
    projectId: 'projectId',
    notebookId: 'notebookId',
  },
  request: new Request('https://my-api.com/endpoint'),
};

const mockedNotebookWithVol: ai.notebook.Notebook = {
  ...mockedNotebook,
  spec: {
    ...mockedNotebookSpec,
    volumes: [mockedDatastoreVolume, mockedPublicGitVolume],
    unsecureHttp: true,
    name: 'notebookName',
  },
  status: {
    ...mockedNotebookStatus,
    state: ai.notebook.NotebookStateEnum.DELETING,
  },
};

describe('Notebook Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          notebookId: 'notebookId',
        }),
      };
    });

    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebook: vi.fn(() => mockedNotebook),
    }));

    vi.mock('@/data/api/ai/notebook/backups/backups.api', () => ({
      getBackups: vi.fn(() => [mockedBackup]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader function', async () => {
    Loader(loaderParam);
    await waitFor(() => {
      expect(notebookAPI.getNotebook).toHaveBeenCalled();
    });
  });

  it('renders skeleton of notebook Layout', async () => {
    render(<NotebookLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('dashboardTab')).toBeInTheDocument();
    });
  });

  it('renders breadcrumb', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.spec.name)).toBeInTheDocument();
    });
  });

  it('renders fully service layout', async () => {
    vi.mocked(notebookAPI.getNotebook).mockImplementationOnce(async () => {
      return mockedNotebook;
    });
    render(<NotebookLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('notebook-header-container'),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(mockedNotebook.spec.name)).toBeInTheDocument();
  });

  it('renders fully service layout', async () => {
    vi.mocked(notebookAPI.getNotebook).mockImplementationOnce(async () => {
      return mockedNotebookWithVol;
    });
    render(<NotebookLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('notebook-header-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedNotebookWithVol.spec.name),
      ).toBeInTheDocument();
    });
  });
});
