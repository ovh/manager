import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as database from '@/types/cloud/project/database';
import * as serviceApi from '@/data/api/database/service.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import {
  mockedAvailabilitiesFlavor,
  mockedAvailabilitiesFlavorTer,
  mockedEngineCapabilitiesUpdate,
  mockedEngineUpdate,
  mockedFlavorUpdate,
  mockedOptionUpdate,
  mockedPlanUpdate,
  mockedPlanUpdateBis,
  mockedRegionCapabilitiesUpdate,
  mockedServiceToUpdate,
  mockedSuggestionsUpdate,
} from '@/__tests__/helpers/mocks/updateMock';
import UpdatePlan from './UpdatePlan.modal';

export const mockedCapabilitiesUpdate: database.Capabilities = {
  disks: ['disk1'],
  engines: [mockedEngineUpdate],
  flavors: [mockedFlavorUpdate],
  options: [mockedOptionUpdate],
  plans: [mockedPlanUpdate, mockedPlanUpdateBis],
  regions: ['gra'],
};

describe('Update Plan modal', () => {
  beforeEach(async () => {
    vi.mock('react-i18next', async (importOriginal) => {
      const mod = await importOriginal<typeof import('react-i18next')>();
      return {
        ...mod,
        useTranslation: () => ({
          t: (key: string) => key,
        }),
      };
    });

    vi.mock('@datatr-ux/uxlib', async () => {
      const mod = await vi.importActual('@datatr-ux/uxlib');
      const toastMock = vi.fn();
      return {
        ...mod,
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedServiceToUpdate,
        category: database.engine.CategoryEnum.operational,
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));

    vi.mock('@/data/api/database/service.api', () => ({
      editService: vi.fn(() => mockedServiceToUpdate),
    }));

    vi.mock('@/data/api/database/availability.api', () => ({
      getAvailabilities: vi.fn(() => [
        mockedAvailabilitiesFlavor,
        mockedAvailabilitiesFlavorTer,
      ]),
      getSuggestions: vi.fn(() => [mockedSuggestionsUpdate]),
    }));

    vi.mock('@/data/api/database/capabilities.api', () => ({
      getEnginesCapabilities: vi.fn(() => [mockedEngineCapabilitiesUpdate]),
      getRegionsCapabilities: vi.fn(() => [mockedRegionCapabilitiesUpdate]),
      getCapabilities: vi.fn(() => mockedCapabilitiesUpdate),
    }));

    vi.mock('@/hooks/api/catalog/useGetCatalog.hook', () => ({
      useGetCatalog: vi.fn(() => ({
        data: {
          addons: [
            {
              planCode: 'databases.mysql-business-db1-4.hour.consumption',
              pricings: [{ price: 1000, tax: 200 }],
            },
            {
              planCode: 'databases.mysql-business-db1-4.month.consumption',
              pricings: [{ price: 20000, tax: 4000 }],
            },
            {
              planCode: 'databases.mysql-enterprise-db1-4.hour.consumption',
              pricings: [{ price: 1000, tax: 200 }],
            },
            {
              planCode: 'databases.mysql-enterprise-db1-4.month.consumption',
              pricings: [{ price: 20000, tax: 4000 }],
            },
            {
              planCode:
                'databases.mysql-business-additionnal-storage-gb.hour.consumption',
              pricings: [{ price: 100, tax: 200 }],
            },
            {
              planCode:
                'databases.mysql-business-additionnal-storage-gb.month.consumption',
              pricings: [{ price: 200, tax: 400 }],
            },
            {
              planCode:
                'databases.mysql-enterprise-additionnal-storage-gb.hour.consumption',
              pricings: [{ price: 100, tax: 200 }],
            },
            {
              planCode:
                'databases.mysql-enterprise-additionnal-storage-gb.month.consumption',
              pricings: [{ price: 200, tax: 400 }],
            },
          ],
        },
        isLoading: false,
      })),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          serviceId: 'serviceId',
        }),
      };
    });

    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton while loading', async () => {
    render(<UpdatePlan />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
    });
  });

  it('open and close update flavor modal', async () => {
    render(<UpdatePlan />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('update-plan-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('update-plan-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('update-plan-modal')).not.toBeInTheDocument();
    });
  });

  it('display error on update error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'updatePlanToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(serviceApi.editService).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<UpdatePlan />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('plan-tile-radio-tile-enterprise'));
      fireEvent.click(screen.getByTestId('update-plan-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on updateFlavor success', async () => {
    render(<UpdatePlan />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('plan-tile-radio-tile-enterprise'));
      fireEvent.click(screen.getByTestId('update-plan-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updatePlanToastSuccessTitle',
        description: 'updatePlanToastSuccessDescription',
      });
    });
  });
});
