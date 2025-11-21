import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import ReStartNotebookModal from './Restart.modal';

describe('Notebooks list restart modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebook: vi.fn(() => mockedNotebook),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render restart modal', async () => {
    render(<ReStartNotebookModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('restart-notebook-modal')).toBeTruthy();
      expect(screen.getByTestId('restart-notebook-submit-button')).toBeTruthy();
    });
  });
});
