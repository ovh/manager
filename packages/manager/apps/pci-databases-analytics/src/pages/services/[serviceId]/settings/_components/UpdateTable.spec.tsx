import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ServiceContext from '@/pages/services/[serviceId]/Service.context';
import * as database from '@/types/cloud/project/database';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import {
  mockedAvailabilities,
  mockedAvailabilitiesUpdate,
} from '@/__tests__/helpers/mocks/availabilities';
import { CdbError } from '@/data/api/database';
import UpdateTable from './UpdateTable.component';

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
    mockedAvailabilitiesUpdate,
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
});
