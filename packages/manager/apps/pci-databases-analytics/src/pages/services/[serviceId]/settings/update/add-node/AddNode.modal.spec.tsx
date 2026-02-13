import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import AddNode from './AddNode.modal';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import * as nodeApi from '@/data/api/database/node.api';

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
  })),
}));

vi.mock('@/data/api/database/node.api', () => ({
  addNode: vi.fn((data) => data.node),
  deleteNode: vi.fn(),
}));
vi.mock('@/data/hooks/catalog/useGetCatalog.hook', () => ({
  useGetCatalog: vi.fn(() => ({
    data: {
      addons: [
        {
          planCode: 'databases.mongodb-plan-flavor.hour.consumption',
          pricings: [{ price: 1000, tax: 200 }],
        },
      ],
    },
    isLoading: false,
  })),
}));

describe('Add Node Modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should open the modal', async () => {
    render(<AddNode />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-node-modal')).toBeInTheDocument();
    });
  });

  it('should add a node on submit', async () => {
    render(<AddNode />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-node-submit-button'));
    });
    await waitFor(() => {
      expect(nodeApi.addNode).toHaveBeenCalledWith({
        projectId: 'projectId',
        engine: mockedService.engine,
        serviceId: mockedService.id,
        node: {
          flavor: mockedService.flavor,
          region: mockedService.nodes[0].region,
        },
      });
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addNodeToastSuccessTitle',
        description: 'addNodeToastSuccessDescription',
      });
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(nodeApi.addNode).mockImplementation(() => {
      throw apiErrorMock;
    });

    render(<AddNode />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-node-submit-button'));
    });
    await waitFor(() => {
      expect(nodeApi.addNode).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addNodeToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'critical',
      });
    });
  });
});
