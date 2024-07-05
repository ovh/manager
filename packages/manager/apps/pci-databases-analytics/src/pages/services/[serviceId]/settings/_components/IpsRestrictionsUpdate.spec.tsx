import { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import Settings from '@/pages/services/[serviceId]/settings/Settings.page';
import * as database from '@/types/cloud/project/database';
import * as serviceApi from '@/data/api/database/service.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import {
  mockedAvailabilities,
  mockedAvailabilitiesUpdate,
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedRegionCapabilities,
} from '@/__tests__/helpers/mocks/availabilities';
import { mockedMaintenance } from '@/__tests__/helpers/mocks/maintenances';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { Locale } from '@/hooks/useLocale';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  capabilities: {
    advancedConfiguration: {
      create: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
    maintenanceApply: {
      create: database.service.capability.StateEnum.enabled,
    },
    service: {
      update: database.service.capability.StateEnum.enabled,
    },
    nodes: {
      delete: database.service.capability.StateEnum.enabled,
      create: database.service.capability.StateEnum.enabled,
    },
    ipRestrictions: {
      update: database.service.capability.StateEnum.enabled,
    },
  },
};

const mockAdvancedConfiguration = { capability: 'capabilityMocked' };

const mockCapabilities: database.capabilities.advancedConfiguration.Property[] = [
  {
    name: 'capability',
    type: database.capabilities.advancedConfiguration.property.TypeEnum.string,
    description: 'capabilityMocked',
  },
];

describe('Ips restrictions update in settings page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));

    vi.mock('@/data/api/database/availability.api', () => ({
      getCapabilities: vi.fn(() => mockedCapabilities),
      getEnginesCapabilities: vi.fn(() => [mockedEngineCapabilities]),
      getRegionsCapabilities: vi.fn(() => [mockedRegionCapabilities]),
      getAvailabilities: vi.fn(() => [
        mockedAvailabilities,
        mockedAvailabilitiesUpdate,
      ]),
    }));

    vi.mock('@/data/api/database/maintenance.api', () => ({
      getMaintenances: vi.fn(() => [mockedMaintenance]),
      applyMaintenance: vi.fn((maintenance) => maintenance),
    }));

    vi.mock('@/data/api/database/advancedConfiguration.api', () => ({
      getAdvancedConfiguration: vi.fn(() => mockAdvancedConfiguration),
      getAdvancedConfigurationCapabilities: vi.fn(() => mockCapabilities),
    }));

    vi.mock('@/data/api/database/service.api', () => ({
      editService: vi.fn((service) => service),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));

    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
          environment: {
            getEnvironment: vi.fn(() => ({
              getUser: vi.fn(() => mockedUser),
            })),
          },
        })),
      };
    });

    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: { children: ReactNode }) => children,
    }));
  });

  it('renders and shows skeletons while loading', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('advanced-config-accordion-trigger'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('maintenance-settings-skeleton'),
      ).toBeInTheDocument();
    });
  });

  it('renders and shows ipsRestrictionUpdate with button', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedServiceOrig.ipRestrictions[0].ip),
      ).toBeInTheDocument();
      expect(screen.getByTestId('ip-input-field')).toBeInTheDocument();
      expect(
        screen.getByTestId('ip-description-field-label'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('ip-add-button')).toBeInTheDocument();
      expect(
        screen.queryByTestId('ips-update-cancel-button'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('ips-update-submit-button'),
      ).not.toBeInTheDocument();
    });
  });

  it('call editService on add ips success', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedServiceOrig.ipRestrictions[0].ip),
      ).toBeInTheDocument();
    });
    const inputDescriptionIp = screen.getByTestId('ip-description-input-field');
    const inputIp = screen.getByTestId('ip-input-field');
    const addButton = screen.getByTestId('ip-add-button');
    act(() => {
      fireEvent.input(inputDescriptionIp, {
        target: {
          value: 'ip3',
        },
      });
      fireEvent.input(inputIp, {
        target: {
          value: '104.140.106.0/32',
        },
      });
      fireEvent.click(addButton);
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('ips-update-cancel-button'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('ips-update-submit-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('ips-update-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalled();
    });
  });
});
