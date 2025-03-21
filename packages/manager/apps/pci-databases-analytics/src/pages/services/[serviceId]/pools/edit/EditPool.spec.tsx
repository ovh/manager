import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import EditPool from './EditPool.modal'; // Adjust the path as needed
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import * as connectionPoolsApi from '@/data/api/database/connectionPool.api';
import * as database from '@/types/cloud/project/database';
import { mockedConnectionPool } from '@/__tests__/helpers/mocks/connectionPool';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';
import { mockedUser } from '@/__tests__/helpers/mocks/user';

vi.mock('@datatr-ux/uxlib', () => ({
  Skeleton: vi.fn(() => <div data-testid="skeleton" />),
}));
vi.mock('../_components/AddEditPool.component', () => ({
  default: vi.fn(() => <div data-testid="add-edit-pool-modal" />),
}));
vi.mock('@/data/api/database/connectionPool.api', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@/data/api/database/connectionPool.api')
  >()),
  getConnectionPools: vi.fn(() => [mockedConnectionPool]),
}));
vi.mock('@/data/api/database/database.api', () => ({
  getServiceDatabases: vi.fn(() => [mockedDatabase]),
}));
vi.mock('@/data/api/database/user.api', () => ({
  getUsers: vi.fn(() => [mockedUser]),
}));
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'projectId',
      category: database.engine.CategoryEnum.all,
      poolId: mockedConnectionPool.id,
    }),
  };
});

describe('Edit Pool modal', () => {
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

  it('should render a skeleton loader while data are being fetched', () => {
    // Simulate loading state in the useGetUsers hook
    vi.mocked(connectionPoolsApi.getConnectionPools).mockImplementationOnce(
      () => {
        throw apiErrorMock;
      },
    );

    render(<EditPool />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should render the modal when data is fetched successfully', async () => {
    // Simulate successful data fetching in the useGetUsers hook
    vi.mocked(connectionPoolsApi.getConnectionPools).mockResolvedValue([
      mockedConnectionPool,
    ]);
    render(<EditPool />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-edit-pool-modal')).toBeInTheDocument();
    });
  });
});
