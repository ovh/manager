import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import EditNamespace from './EditNamespace.modal'; // Adjust the path as needed
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import * as namespacesApi from '@/data/api/database/namespace.api';
import * as database from '@/types/cloud/project/database';
import { mockedNamespaces } from '@/__tests__/helpers/mocks/namespaces';

vi.mock('@datatr-ux/uxlib', () => ({
  Skeleton: vi.fn(() => <div data-testid="skeleton" />),
}));
vi.mock('../_components/AddEditNamespace.component', () => ({
  default: vi.fn(() => <div data-testid="add-edit-namespace-modal" />),
}));
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'projectId',
      category: database.engine.CategoryEnum.all,
      namespaceId: mockedNamespaces.id,
    }),
  };
});
vi.mock('@/data/api/database/namespace.api', () => ({
  getNamespaces: vi.fn(() => [mockedNamespaces]),
  addNamespace: vi.fn((namespace) => namespace),
  deleteNamespace: vi.fn(),
  editNamespace: vi.fn((namespace) => namespace),
}));

describe('Edit Namespace modal', () => {
  beforeEach(() => {
    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render a skeleton loader while namespaces are being fetched', () => {
    // Simulate loading state in the useGetUsers hook
    vi.mocked(namespacesApi.getNamespaces).mockImplementationOnce(() => {
      throw apiErrorMock;
    });

    render(<EditNamespace />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should render the modal when data is fetched successfully', async () => {
    // Simulate successful data fetching in the useGetUsers hook
    vi.mocked(namespacesApi.getNamespaces).mockResolvedValue([
      mockedNamespaces,
    ]);
    render(<EditNamespace />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('add-edit-namespace-modal'),
      ).toBeInTheDocument();
    });
  });
});
