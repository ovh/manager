import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AddNamespace from './AddNamespace.modal'; // Adjust the path as needed
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import * as namespacesApi from '@/data/api/database/namespace.api';
import { mockedNamespaces } from '@/__tests__/helpers/mocks/namespaces';

vi.mock('@datatr-ux/uxlib', () => ({
  Skeleton: vi.fn(() => <div data-testid="skeleton" />),
}));
vi.mock('../_components/AddEditNamespace.component', () => ({
  default: vi.fn(() => <div data-testid="add-edit-namespace-modal" />),
}));
vi.mock('@/data/api/database/namespace.api', () => ({
  getNamespaces: vi.fn(() => [mockedNamespaces]),
  addNamespace: vi.fn((namespace) => namespace),
  deleteNamespace: vi.fn(),
  editNamespace: vi.fn((namespace) => namespace),
}));

describe('Add Namespace modal', () => {
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

  it('should render a skeleton loader while users are being fetched', () => {
    // Simulate loading state in the useGetUsers hook
    vi.mocked(namespacesApi.getNamespaces).mockImplementationOnce(() => {
      throw apiErrorMock;
    });

    render(<AddNamespace />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should render AddEditUserModal with users when data is fetched successfully', async () => {
    // Simulate successful data fetching in the useGetUsers hook
    vi.mocked(namespacesApi.getNamespaces).mockResolvedValue([
      mockedNamespaces,
    ]);
    render(<AddNamespace />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('add-edit-namespace-modal'),
      ).toBeInTheDocument();
    });
  });
});
