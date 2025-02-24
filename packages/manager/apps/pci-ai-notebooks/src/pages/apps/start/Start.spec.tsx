import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedApp } from '@/__tests__/helpers/mocks/app';
import StartAppModal from './Start.modal';

describe('Apps list start modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/app/app.api', () => ({
      getApp: vi.fn(() => mockedApp),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render start modal', async () => {
    render(<StartAppModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('start-app-modal')).toBeInTheDocument();
      expect(screen.getByTestId('start-app-submit-button')).toBeInTheDocument();
    });
  });
});
