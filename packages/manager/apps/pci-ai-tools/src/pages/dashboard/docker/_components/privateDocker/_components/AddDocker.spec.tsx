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
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import { mockedRegistry } from '@/__tests__/helpers/mocks/shared/registry';
import AddDocker from './AddDocker.modal';
import { handleSelectOption } from '@/__tests__/helpers/unitTestHelper';

describe('AddDocker modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/registry/registry.api', () => ({
      addRegistry: vi.fn(() => mockedRegistry),
    }));

    vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal skeleton while loading', async () => {
    render(<AddDocker />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
  });

  it('open and close add docker modal', async () => {
    render(<AddDocker />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-docker-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-docker-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-docker-modal')).not.toBeInTheDocument();
    });
  });

  it('renders addDocker and display toast error', async () => {
    render(<AddDocker />, { wrapper: RouterWithQueryClientWrapper });
    const errorMsg = {
      description: 'api error message',
      title: 'formDockerToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(registryApi.addRegistry).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-docker-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-username-input'), {
        target: {
          value: 'userName',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-password-input'), {
        target: {
          value: 'password',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-url-input'), {
        target: {
          value: 'https://docker.io',
        },
      });
    });

    // Select region
    await handleSelectOption('select-region-trigger', 'GRA');

    act(() => {
      fireEvent.click(screen.getByTestId('add-docker-submit-button'));
    });
    await waitFor(() => {
      expect(registryApi.addRegistry).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('renders addToken and refresh getRegistries after added', async () => {
    render(<AddDocker />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-docker-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-username-input'), {
        target: {
          value: 'userName',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-password-input'), {
        target: {
          value: 'password',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-url-input'), {
        target: {
          value: 'https://docker.io',
        },
      });
    });

    // Select region
    await handleSelectOption('select-region-trigger', 'GRA');

    act(() => {
      fireEvent.click(screen.getByTestId('add-docker-submit-button'));
    });
    await waitFor(() => {
      expect(registryApi.addRegistry).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formDockerToastSuccessTitle',
        description: 'formDockerToastSuccessDescription',
      });
    });
  });
});
