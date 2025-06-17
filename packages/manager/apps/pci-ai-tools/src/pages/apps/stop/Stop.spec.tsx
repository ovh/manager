import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import StopAppModal from './Stop.modal';

describe('Apps list stop modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/app/app.api', () => ({
      getApp: vi.fn(() => mockedApp),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render stop modal', async () => {
    render(<StopAppModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('stop-app-modal')).toBeTruthy();
      expect(screen.getByTestId('stop-app-submit-button')).toBeTruthy();
    });
  });
});
