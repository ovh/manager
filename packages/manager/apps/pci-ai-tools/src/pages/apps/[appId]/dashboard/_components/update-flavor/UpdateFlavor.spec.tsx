import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import * as appApi from '@/data/api/ai/app/app.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import UpdateFlavor from './UpdateFlavor.modal';
import {
  mockedCapabilitiesFlavorCPU,
  mockedCapabilitiesFlavorGPU,
} from '@/__tests__/helpers/mocks/capabilities/flavor';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog/catalog';

describe('Update Flavor modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: mockedApp,
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/app/app.api', () => ({
      updateApp: vi.fn(() => mockedApp),
    }));

    vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
      getFlavor: vi.fn(() => [
        mockedCapabilitiesFlavorCPU,
        mockedCapabilitiesFlavorGPU,
      ]),
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton while loading', async () => {
    render(<UpdateFlavor />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dialog-container')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(appApi.updateApp).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<UpdateFlavor />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(
        screen.getByTestId(
          `flavor-table-row-${mockedCapabilitiesFlavorGPU.id}`,
        ),
      );
      fireEvent.click(screen.getByTestId('update-flavor-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.updateApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateFlavorToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<UpdateFlavor />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(
        screen.getByTestId(
          `flavor-table-row-${mockedCapabilitiesFlavorGPU.id}`,
        ),
      );
      fireEvent.click(screen.getByTestId('update-flavor-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.updateApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateFlavorToastSuccessTitle',
        description: 'updateFlavorToastSuccessDescription',
      });
    });
  });
});
