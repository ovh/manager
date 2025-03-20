import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useToast } from '@datatr-ux/uxlib';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog/catalog';
import { mockedPciProject } from '@/__tests__/helpers/mocks/project';
import {
  mockedCapabilitiesRegionBHS,
  mockedCapabilitiesRegionGRA,
} from '@/__tests__/helpers/mocks/capabilities/region';
import {
  mockedSshKey,
  mockedSshKeyBis,
} from '@/__tests__/helpers/mocks/sshkey';
import { mockedCommand } from '@/__tests__/helpers/mocks/shared/command';
import { mockedCapabilitiesFlavorCPU } from '@/__tests__/helpers/mocks/capabilities/flavor';
import {
  mockedDatastoreWithContainerGit,
  mockedDatastoreWithContainerS3,
} from '@/__tests__/helpers/mocks/volume/datastore';
import * as jobApi from '@/data/api/ai/job/job.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import Job, { breadcrumb as Breadcrumb } from './Create.page';
import {
  mockedPresetImage,
  mockedPresetImageBis,
} from '@/__tests__/helpers/mocks/job/presetImage';
import { mockedSuggestionsForJob } from '@/__tests__/helpers/mocks/suggestion';

describe('Order funnel page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();

    vi.mock('@/data/api/project/project.api', () => {
      return {
        getProject: vi.fn(() => mockedPciProject),
      };
    });

    vi.mock('@/data/api/ai/job/job.api', () => ({
      getCommand: vi.fn(() => mockedCommand),
      addJob: vi.fn((job) => job),
    }));

    vi.mock('@/data/api/ai/job/suggestions.api', () => ({
      getSuggestions: vi.fn(() => mockedSuggestionsForJob),
    }));

    vi.mock('@/data/api/ai/job/capabilities/image.api', () => ({
      getPresetImage: vi.fn(() => [mockedPresetImage, mockedPresetImageBis]),
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));

    vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
      getRegions: vi.fn(() => [
        mockedCapabilitiesRegionGRA,
        mockedCapabilitiesRegionBHS,
      ]),
      getFlavor: vi.fn(() => [mockedCapabilitiesFlavorCPU]),
    }));

    vi.mock('@/data/api/ai/data/datastore.api', () => ({
      getDatastores: vi.fn(() => [
        mockedDatastoreWithContainerGit,
        mockedDatastoreWithContainerS3,
      ]),
    }));

    vi.mock('@/data/api/sshkey/sshkey.api', () => ({
      getSshkey: vi.fn(() => [mockedSshKey, mockedSshKeyBis]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders the skeleton component while loading', async () => {
    render(<Job />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-skeleton')).toBeInTheDocument();
    });
  });

  it('renders the order funnel', async () => {
    render(<Job />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
      expect(screen.getByTestId('name-section')).toBeInTheDocument();
      expect(screen.getByTestId('flavor-section')).toBeInTheDocument();
      expect(screen.getByTestId('region-section')).toBeInTheDocument();
      expect(screen.getByTestId('image-section')).toBeInTheDocument();
      expect(screen.getByTestId('advance-config-section')).toBeInTheDocument();
      expect(screen.getByTestId('order-submit-button')).toBeInTheDocument();
    });
  });

  it('trigger toast error on getCommand API Error', async () => {
    vi.mocked(jobApi.getCommand).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<Job />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('advanced-config-button'));
    });
    act(() => {
      fireEvent.click(screen.getByTestId('cli-command-button'));
    });
    await waitFor(() => {
      expect(jobApi.getCommand).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorGetCommandCli',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger getCommand on Cli Command button click', async () => {
    render(<Job />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('cli-command-button'));
    });
    await waitFor(() => {
      expect(jobApi.getCommand).toHaveBeenCalled();
    });
  });

  it('trigger toast error on add Job API Error', async () => {
    vi.mocked(jobApi.addJob).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<Job />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });
    await waitFor(() => {
      expect(jobApi.addJob).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorCreatingJob',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger add Job on click', async () => {
    render(<Job />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });
    await waitFor(() => {
      expect(jobApi.addJob).toHaveBeenCalled();
    });
    expect(mockedUsedNavigate).toHaveBeenCalledWith('../training/undefined');
  });
});
