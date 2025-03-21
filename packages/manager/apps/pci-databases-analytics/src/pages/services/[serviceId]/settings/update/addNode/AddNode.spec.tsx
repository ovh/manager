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
import AddNode from './AddNode.modal';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import * as nodeApi from '@/data/api/database/node.api';

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'projectId',
    }),
  };
});
vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
  })),
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));
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
vi.mock('@/data/api/database/node.api', () => ({
  addNode: vi.fn((data) => data.node),
  deleteNode: vi.fn(),
}));
vi.mock('@/hooks/api/catalog/useGetCatalog.hook', () => ({
  useGetCatalog: vi.fn(() => ({
    data: {
      addons: [
        {
          planCode: 'databases.mongodb-plan-flavor.hour.consumption',
          pricings: [{ price: 1000, tax: 200 }],
        },
        {
          planCode: 'databases.mongodb-plan-flavor.month.consumption',
          pricings: [{ price: 20000, tax: 4000 }],
        },
      ],
    },
    isLoading: false,
  })),
}));

describe('Add Node Modal', () => {
  beforeEach(() => {});
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
        variant: 'destructive',
      });
    });
  });
});
