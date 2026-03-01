import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import Fork, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/backups/fork/ForkBackup.page';
import ForkSummary from '@/pages/services/[serviceId]/backups/fork/_components/ForkSummary.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedAvailabilities,
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedRegionCapabilities,
} from '@/__tests__/helpers/mocks/availabilities';
import * as database from '@/types/cloud/project/database';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import { mockedForkService } from '@/__tests__/helpers/mocks/services';
import {
  mockedBackup,
  mockedBackupBis,
} from '@/__tests__/helpers/mocks/backup';
import {
  mockedNetworksFork,
  mockedSubnets,
} from '@/__tests__/helpers/mocks/network';
import { ForkSourceType } from '@/types/orderFunnel';
import {
  mockedBasicOrderFunnelFlavor,
  mockedBasicOrderFunnelPlan,
  mockedEngineVersion,
  mockedOrderFunnelEngine,
  mockedOrderFunnelRegion,
} from '@/__tests__/helpers/mocks/order-funnel';
import {
  NetworkRegionStatusEnum,
  NetworkStatusEnum,
  NetworkTypeEnum,
} from '@/types/cloud/network';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import * as ServiceAPI from '@/data/api/database/service.api';

const mockedFork = {
  source: {
    type: ForkSourceType.backup,
    backupId: 'backupId',
    serviceId: 'serviceId',
  },
  backup: mockedBackup,
  engine: mockedOrderFunnelEngine,
  version: mockedEngineVersion,
  plan: mockedBasicOrderFunnelPlan,
  region: mockedOrderFunnelRegion,
  flavor: mockedBasicOrderFunnelFlavor,
  nodes: 3,
  additionalStorage: 10,
  name: 'myNewForkedPG',
  ipRestrictions: [
    {
      ip: 'ips',
      description: 'IpDescription',
    },
  ],
  network: {
    type: database.NetworkTypeEnum.private,
    network: {
      id: 'id1',
      name: 'network1',
      regions: [
        {
          region: 'GRA',
          openstackId: '123456',
          status: NetworkRegionStatusEnum.ACTIVE,
        },
      ],
      vlanId: 0,
      status: NetworkStatusEnum.ACTIVE,
      type: NetworkTypeEnum.private,
    },
  },
};

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedForkService,
    category: 'all',
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  })),
}));

vi.mock('@/data/api/database/availability.api', () => ({
  getAvailabilities: vi.fn(() => [mockedAvailabilities]),
}));

vi.mock('@/data/api/database/capabilities.api', () => ({
  getEnginesCapabilities: vi.fn(() => [mockedEngineCapabilities]),
  getRegionsCapabilities: vi.fn(() => [mockedRegionCapabilities]),
  getCapabilities: vi.fn(() => mockedCapabilities),
}));

vi.mock('@/data/api/database/backup.api', () => ({
  getServiceBackups: vi.fn(() => [mockedBackup, mockedBackupBis]),
}));

vi.mock('@/data/api/network/network.api', () => ({
  networkApi: {
    getPrivateNetworks: vi.fn(() => mockedNetworksFork),
    getSubnets: vi.fn(() => mockedSubnets),
  },
}));

vi.mock('@/data/api/catalog/catalog.api', () => ({
  catalogApi: {
    getCatalog: vi.fn(() => mockedCatalog),
  },
}));

vi.mock('@/data/api/database/service.api', () => ({
  addService: vi.fn((service) => service),
}));

describe('Fork funnel page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient()
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
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-skeleton')).toBeInTheDocument();
    });
  });

  it('fork summary click link display section', async () => {
    const mockedOnSectionClicked = vi.fn();
    render(
      <ForkSummary
        order={mockedFork}
        onSectionClicked={mockedOnSectionClicked}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByText(mockedFork.name)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('source-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('source');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('plan-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('plan');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('region-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('region');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('flavor-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('flavor');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('cluster-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('cluster');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('network-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('options');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('ips-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('options');
    });
  });

  it('renders pitr section and fork error display toast error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'errorCreatingService',
      variant: 'critical',
    };
    vi.mocked(ServiceAPI.addService).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('fork-form-container')).toBeInTheDocument();
      expect(screen.getByTestId('fork-submit-button')).toBeInTheDocument();
      expect(screen.getByTestId('radio-button-pitr')).toBeInTheDocument();
      expect(screen.getByTestId('radio-button-pitr')).not.toBeDisabled();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('radio-button-pitr'));
    });
    await waitFor(() => {
      expect(screen.getByText('inputSourcePITPlaceholder')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('radio-button-now'));
    });
    act(() => {
      fireEvent.click(screen.getByTestId('fork-submit-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('Fork Submit button call Add Service and success toast', async () => {
    const successMsg = {
      title: 'successCreatingService',
    };
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('radio-button-now'));
    });
    act(() => {
      fireEvent.click(screen.getByTestId('fork-submit-button'));
    });
    await waitFor(() => {
      expect(ServiceAPI.addService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(successMsg);
    });
  });
});
