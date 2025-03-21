import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog/catalog';
import { mockedPciProject } from '@/__tests__/helpers/mocks/project';
import {
  mockedCapabilitiesRegionBHS,
  mockedCapabilitiesRegionGRA,
} from '@/__tests__/helpers/mocks/capabilities/region';
import { mockedCommand } from '@/__tests__/helpers/mocks/shared/command';
import { mockedCapabilitiesFlavorCPU } from '@/__tests__/helpers/mocks/capabilities/flavor';
import {
  mockedDatastoreWithContainerGit,
  mockedDatastoreWithContainerS3,
} from '@/__tests__/helpers/mocks/volume/datastore';
import * as appApi from '@/data/api/ai/app/app.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import App, { breadcrumb as Breadcrumb } from './Create.page';
import {
  mockedContract,
  mockedPartner,
  mockedPartnerImagePerApp,
} from '@/__tests__/helpers/mocks/partner/partner';
import { mockedSuggestionsForApp } from '@/__tests__/helpers/mocks/suggestion';

describe('Order funnel page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    mockedUsedNavigate();

    vi.mock('@/data/api/project/project.api', () => {
      return {
        getProject: vi.fn(() => mockedPciProject),
      };
    });

    vi.mock('@/data/api/ai/app/suggestions.api', () => ({
      getSuggestions: vi.fn(() => mockedSuggestionsForApp),
    }));

    vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
      getRegions: vi.fn(() => [
        mockedCapabilitiesRegionGRA,
        mockedCapabilitiesRegionBHS,
      ]),
      getFlavor: vi.fn(() => [mockedCapabilitiesFlavorCPU]),
      getAppImages: vi.fn(() => [mockedPartnerImagePerApp]),
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));

    vi.mock('@/data/api/ai/datastore.api', () => ({
      getDatastores: vi.fn(() => [
        mockedDatastoreWithContainerGit,
        mockedDatastoreWithContainerS3,
      ]),
    }));

    vi.mock('@/data/api/ai/app/app.api', () => ({
      getCommand: vi.fn(() => mockedCommand),
      addApp: vi.fn((app) => app),
    }));

    vi.mock('@/data/api/ai/partner.api', () => ({
      signPartnerContract: vi.fn(() => mockedContract),
      getPartner: vi.fn(() => [mockedPartner]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeTruthy();
    });
  });

  it('renders the skeleton component while loading', async () => {
    render(<App />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-skeleton')).toBeTruthy();
    });
  });

  it('renders the order funnel', async () => {
    render(<App />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
      expect(screen.getByTestId('name-section')).toBeTruthy();
      expect(screen.getByTestId('flavor-section')).toBeTruthy();
      expect(screen.getByTestId('region-section')).toBeTruthy();
      expect(screen.getByTestId('image-section')).toBeTruthy();
      expect(screen.getByTestId('advance-config-section')).toBeTruthy();
      expect(screen.getByTestId('order-submit-button')).toBeTruthy();
    });
  });

  it('trigger toast error on getCommand API Error', async () => {
    vi.mocked(appApi.getCommand).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<App />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-custom-image-input'), {
        target: {
          value: 'myNewImage',
        },
      });
      fireEvent.click(screen.getByTestId('docker-custom-image-add-button'));
      fireEvent.click(screen.getByTestId('cli-command-button'));
    });
    await waitFor(() => {
      expect(appApi.getCommand).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorGetCommandCli',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger getCommand on Cli Command button click', async () => {
    render(<App />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-custom-image-input'), {
        target: {
          value: 'myNewImage',
        },
      });
      fireEvent.click(screen.getByTestId('docker-custom-image-add-button'));
      fireEvent.click(screen.getByTestId('cli-command-button'));
    });
    await waitFor(() => {
      expect(appApi.getCommand).toHaveBeenCalled();
    });
  });

  it('trigger toast error on add App API Error', async () => {
    vi.mocked(appApi.addApp).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<App />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-custom-image-input'), {
        target: {
          value: 'myNewImage',
        },
      });
      fireEvent.click(screen.getByTestId('docker-custom-image-add-button'));
    });
    await waitFor(() => {
      expect(screen.getByText('myNewImage')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });

    await waitFor(() => {
      expect(appApi.addApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorCreatingApp',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger add Job on click', async () => {
    render(<App />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeTruthy();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-custom-image-input'), {
        target: {
          value: 'myNewImage',
        },
      });
      fireEvent.click(screen.getByTestId('docker-custom-image-add-button'));
    });
    await waitFor(() => {
      expect(screen.getByText('myNewImage')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.addApp).toHaveBeenCalled();
    });
    expect(mockedUsedNavigate).toHaveBeenCalledWith('../undefined');
  });
});
