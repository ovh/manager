import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { useNotebookData } from './Notebook.context';

describe('Notebook context', () => {
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
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return notebook data when projectId in params', async () => {
    const { result } = renderHook(() => useNotebookData(), {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(result.current.projectId).toBe('projectId');
  });
});
