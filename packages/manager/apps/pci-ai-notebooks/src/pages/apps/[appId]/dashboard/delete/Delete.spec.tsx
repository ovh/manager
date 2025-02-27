import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import DeleteAppModal from './Delete.modal';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';

describe('App dashboard delete modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/app/app.api', () => ({
      getApp: vi.fn(() => mockedApp),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render delete modal', async () => {
    render(<DeleteAppModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('delete-app-modal')).toBeInTheDocument();
      expect(
        screen.getByTestId('delete-app-submit-button'),
      ).toBeInTheDocument();
    });
  });
});
