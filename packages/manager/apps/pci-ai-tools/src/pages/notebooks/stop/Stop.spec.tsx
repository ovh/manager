import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import StopNotebookModal from './Stop.modal';

describe('Notebooks list stop modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebook: vi.fn(() => mockedNotebook),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render stop modal', async () => {
    render(<StopNotebookModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('stop-notebook-modal')).toBeInTheDocument();
      expect(
        screen.getByTestId('stop-notebook-submit-button'),
      ).toBeInTheDocument();
    });
  });
});
