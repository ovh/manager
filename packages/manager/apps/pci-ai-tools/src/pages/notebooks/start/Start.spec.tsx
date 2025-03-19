import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import StartNotebookModal from './Start.modal';

describe('Notebooks list start modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebook: vi.fn(() => mockedNotebook),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render start modal', async () => {
    render(<StartNotebookModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('start-notebook-modal')).toBeInTheDocument();
      expect(
        screen.getByTestId('start-notebook-submit-button'),
      ).toBeInTheDocument();
    });
  });
});
