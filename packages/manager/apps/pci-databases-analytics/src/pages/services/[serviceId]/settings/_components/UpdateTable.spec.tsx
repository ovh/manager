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
  },
};

const mockedUsedNavigate = vi.fn();

describe('Update table in settings page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));
    // Mock necessary hooks and dependencies
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
      };
    });

    vi.mock('@/data/api/database/availability.api', () => ({
      getAvailabilities: vi.fn(() => [
        mockedAvailabilities,
        mockedAvailabilitiesUpdate,
      ]),
    }));

    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: { children: ReactNode }) => children,
    }));
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
      expect(updateVersionButton).toBeDisabled();
      expect(updatePlanButton).toBeInTheDocument();
      expect(updatePlanButton).toBeDisabled();
      expect(updateFlavorButton).toBeInTheDocument();
      expect(updateFlavorButton).toBeDisabled();
      expect(updateStorageButton).toBeInTheDocument();
      expect(updateStorageButton).toBeDisabled();
      expect(createNodeButton).toBeInTheDocument();
      expect(createNodeButton).toBeDisabled();
      expect(deleteNodeButton).toBeInTheDocument();
      expect(deleteNodeButton).toBeDisabled();
    });
  });
});

describe('Open modals', () => {
  beforeEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<UpdateTable />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedServiceOrig.plan)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('open update version modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('update-button-tableVersion'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./update-version');
    });
  });

  it('open update plan modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('update-button-tablePlan'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./update-plan');
    });
  });

  it('open update flavor modal', async () => {
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Stub the global ResizeObserver
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    act(() => {
      fireEvent.click(screen.getByTestId('update-button-tableFlavor'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./update-flavor');
    });
  });

  it('open add node modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('create-node-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add-node');
    });
  });

  it('open delete node modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('delete-node-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete-node');
    });
  });
});
