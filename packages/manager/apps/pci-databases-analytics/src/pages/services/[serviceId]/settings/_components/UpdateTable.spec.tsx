import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ServiceContext from '@/pages/services/[serviceId]/Service.context';
import * as database from '@/types/cloud/project/database';
import * as availabilityApi from '@/data/api/database/availability.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import {
  mockedAvailabilities,
  mockedAvailabilitiesUpdate,
} from '@/__tests__/helpers/mocks/availabilities';
import { CdbError } from '@/data/api/database';
import UpdateTable from './UpdateTable.component';

// An availability the current service can migrate to: it differs from the
// current service (mockedAvailabilities) on version, plan and flavor.
const mockedAvailabilityTarget: database.Availability = {
  ...mockedAvailabilitiesUpdate,
  version: 'version2',
  plan: 'plan2',
  specifications: {
    ...mockedAvailabilitiesUpdate.specifications,
    flavor: 'flavor2',
  },
};

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  capabilities: {
    service: {
      update: database.service.capability.StateEnum.enabled,
    },
    nodes: {
      delete: database.service.capability.StateEnum.enabled,
      create: database.service.capability.StateEnum.enabled,
    },
    serviceIpRestriction: {
      update: database.service.capability.StateEnum.enabled,
    },
    serviceFlavor: {
      update: database.service.capability.StateEnum.enabled,
    },
    serviceDisk: {
      update: database.service.capability.StateEnum.enabled,
    },
  },
};

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
    category: 'operational',
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  })),
}));


vi.mock('@/data/api/database/availability.api', () => ({
  getAvailabilities: vi.fn(() => [
    mockedAvailabilities,
    {
      ...mockedAvailabilitiesUpdate,
      version: 'version2',
      plan: 'plan2',
      specifications: {
        ...mockedAvailabilitiesUpdate.specifications,
        flavor: 'flavor2',
      },
    },
  ]),
}));


describe('Update table in settings page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and shows update table with button', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<UpdateTable />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      const updateVersionButton = screen.getByTestId(
        'update-button-tableVersion',
      );
      const updatePlanButton = screen.getByTestId('update-button-tablePlan');
      const updateFlavorButton = screen.getByTestId(
        'update-button-tableFlavor',
      );
      const updateStorageButton = screen.getByTestId(
        'update-button-tableStorage',
      );
      const createNodeButton = screen.getByTestId('create-node-button');
      const deleteNodeButton = screen.getByTestId('delete-node-button');
      expect(screen.getByText(mockedServiceOrig.plan)).toBeInTheDocument();
      expect(updateVersionButton).toBeInTheDocument();
      expect(updatePlanButton).toBeInTheDocument();
      expect(updateFlavorButton).toBeInTheDocument();
      expect(updateStorageButton).toBeInTheDocument();
      expect(createNodeButton).toBeInTheDocument();
      expect(deleteNodeButton).toBeInTheDocument();
    });
  });

  it('renders and shows update table with button disabled', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          service: {
            update: database.service.capability.StateEnum.disabled,
          },
          nodes: {
            delete: database.service.capability.StateEnum.disabled,
            create: database.service.capability.StateEnum.disabled,
          },
          serviceFlavor: {
            update: database.service.capability.StateEnum.disabled,
          },
          serviceDisk: {
            update: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<UpdateTable />, { wrapper: RouterWithQueryClientWrapper });
    const updateVersionButton = screen.getByTestId(
      'update-button-tableVersion',
    );
    const updatePlanButton = screen.getByTestId('update-button-tablePlan');
    const updateFlavorButton = screen.getByTestId('update-button-tableFlavor');
    const updateStorageButton = screen.getByTestId(
      'update-button-tableStorage',
    );
    const createNodeButton = screen.getByTestId('create-node-button');
    const deleteNodeButton = screen.getByTestId('delete-node-button');
    await waitFor(() => {
      expect(screen.getByText(mockedServiceOrig.plan)).toBeInTheDocument();
      expect(updateVersionButton).toBeInTheDocument();
      expect(updateVersionButton.className).toContain('cursor-not-allowed');
      expect(updatePlanButton).toBeInTheDocument();
      expect(updatePlanButton.className).toContain('cursor-not-allowed');
      expect(updateFlavorButton).toBeInTheDocument();
      expect(updateFlavorButton.className).toContain('cursor-not-allowed');
      expect(updateStorageButton).toBeInTheDocument();
      expect(updateStorageButton.className).toContain('cursor-not-allowed');
      expect(createNodeButton).toBeInTheDocument();
      expect(createNodeButton.className).toContain('cursor-not-allowed');
      expect(deleteNodeButton).toBeInTheDocument();
      expect(deleteNodeButton.className).toContain('cursor-not-allowed');
    });
  });

  it('still shows update buttons when the current service is EOS/EOL', async () => {
    // Simulate an EOS/EOL service: it is filtered out of the status-filtered
    // availabilities (version/plan/flavor), and is only returned by the 'self'
    // target which has no status filter.
    vi.mocked(availabilityApi.getAvailabilities).mockImplementation(
      ({ target }) => {
        if (target === database.availability.TargetEnum.self) {
          return Promise.resolve([mockedAvailabilities]);
        }
        return Promise.resolve([mockedAvailabilityTarget]);
      },
    );
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<UpdateTable />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('update-button-tableVersion'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('update-button-tablePlan')).toBeInTheDocument();
      expect(
        screen.getByTestId('update-button-tableFlavor'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('update-button-tableStorage'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('create-node-button')).toBeInTheDocument();
      expect(screen.getByTestId('delete-node-button')).toBeInTheDocument();
    });
  });

  it('hides storage/nodes controls when the current offer is EOS/EOL', async () => {
    // The current offer is end of sale: it cannot be modified server-side, so
    // storage and node scaling controls must not be offered (only migration
    // buttons remain). The current is returned by the 'self' target.
    const eosCurrent: database.Availability = {
      ...mockedAvailabilities,
      lifecycle: {
        ...mockedAvailabilities.lifecycle,
        status: database.availability.StatusEnum.END_OF_SALE,
      },
    };
    vi.mocked(availabilityApi.getAvailabilities).mockImplementation(
      ({ target }) => {
        if (target === database.availability.TargetEnum.self) {
          return Promise.resolve([eosCurrent]);
        }
        return Promise.resolve([mockedAvailabilityTarget]);
      },
    );
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<UpdateTable />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      // migration buttons remain
      expect(
        screen.getByTestId('update-button-tableVersion'),
      ).toBeInTheDocument();
    });
    // storage/nodes controls are hidden
    expect(
      screen.queryByTestId('update-button-tableStorage'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('create-node-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-node-button')).not.toBeInTheDocument();
  });

  it('keeps storage/nodes controls when the self query returns nothing (fallback to flavor list)', async () => {
    // Healthy service, but the 'self' availability query yields nothing: the
    // storage/nodes controls must fall back to the current flavor found in the
    // status-filtered flavor availabilities instead of disappearing.
    vi.mocked(availabilityApi.getAvailabilities).mockImplementation(
      ({ target }) => {
        if (target === database.availability.TargetEnum.self) {
          return Promise.resolve([]);
        }
        return Promise.resolve([mockedAvailabilities, mockedAvailabilityTarget]);
      },
    );
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<UpdateTable />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('update-button-tableStorage'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('create-node-button')).toBeInTheDocument();
      expect(screen.getByTestId('delete-node-button')).toBeInTheDocument();
    });
  });
});
