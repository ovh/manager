import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as registryApi from '@/data/api/ai/registry/registry.api';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import DeleteDocker from './DeleteDocker.modal';

describe('DeleteDocker modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/registry/registry.api', () => ({
      deleteRegistry: vi.fn(),
    }));

    vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close delete docker modal', async () => {
    render(<DeleteDocker />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-docker-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-docker-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-docker-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('display error on delete docker error', async () => {
    render(<DeleteDocker />, { wrapper: RouterWithQueryClientWrapper });
    const errorMsg = {
      description: 'api error message',
      title: 'deleteDockerToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(registryApi.deleteRegistry).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-docker-submit-button'));
    });
    await waitFor(() => {
      expect(registryApi.deleteRegistry).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete docker success', async () => {
    render(<DeleteDocker />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-docker-submit-button'));
    });
    await waitFor(() => {
      expect(registryApi.deleteRegistry).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteDockerToastSuccessTitle',
        description: 'deleteDockerToastSuccessDescription',
      });
    });
  });
});
