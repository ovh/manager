import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import DeleteNotebookModal from './Delete.modal';

describe('Notebooks list delete modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebook: vi.fn(() => mockedNotebook),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render delete modal', async () => {
    render(<DeleteNotebookModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('delete-notebook-modal')).toBeTruthy();
      expect(screen.getByTestId('delete-notebook-submit-button')).toBeTruthy();
    });
  });
});
