import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Root, { Loader } from '@/pages/notebooks/NotebookRoot.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';

const NotebookProps = {
  params: {
    projectId: 'projectId',
  },
  request: new Request('https://my-api.com/endpoint'),
};

describe('Home page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        redirect: vi.fn(),
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });

    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebooks: vi.fn(() => []),
    }));
  });

  it('fetches notebook data', async () => {
    Loader(NotebookProps);
    await waitFor(() => {
      expect(notebookApi.getNotebooks).toHaveBeenCalled();
    });
  });

  it('should display notebook page', async () => {
    vi.mocked(notebookApi.getNotebooks).mockResolvedValue([mockedNotebook]);
    render(<Root />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('notebooks-guides-container'),
      ).toBeInTheDocument();
    });
  });
});
