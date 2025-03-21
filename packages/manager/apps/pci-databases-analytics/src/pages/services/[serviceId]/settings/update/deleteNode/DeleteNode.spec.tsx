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
import DeleteNode from './DeleteNode.modal';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import * as nodeApi from '@/data/api/database/node.api';
import { mockedNode } from '@/__tests__/helpers/mocks/nodes';

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

describe('Delete Node Modal', () => {
  beforeEach(() => {});
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should open the modal', async () => {
    render(<DeleteNode />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-node-modal')).toBeInTheDocument();
    });
  });

  it('should delete a node on submit', async () => {
    render(<DeleteNode />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-node-submit-button'));
    });
    await waitFor(() => {
      expect(nodeApi.deleteNode).toHaveBeenCalledWith({
        projectId: 'projectId',
        engine: mockedService.engine,
        serviceId: mockedService.id,
        nodeId: mockedNode.id,
      });
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteNodeToastSuccessTitle',
        description: 'deleteNodeToastSuccessDescription',
      });
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(nodeApi.deleteNode).mockImplementation(() => {
      throw apiErrorMock;
    });

    render(<DeleteNode />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-node-submit-button'));
    });
    await waitFor(() => {
      expect(nodeApi.deleteNode).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteNodeToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });
});
