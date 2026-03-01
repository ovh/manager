import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockedUsedNavigate, setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedConnectionPool } from '@/__tests__/helpers/mocks/connectionPool';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';
import InfoConnectionPool from './ViewPoolConnectionInfo.modal';
import * as connectionPoolApi from '@/data/api/database/connectionPool.api';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedUser } from '@/__tests__/helpers/mocks/user';

const mockedCertificate = { ca: 'certificateCA' };

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
  })),
}));
vi.mock('@/data/api/database/connectionPool.api', () => ({
  getConnectionPools: vi.fn(() => [mockedConnectionPool]),
  addConnectionPool: vi.fn((pool) => pool),
  editConnectionPool: vi.fn((pool) => pool),
  deleteConnectionPool: vi.fn(),
}));
vi.mock('@/data/api/database/certificate.api', () => ({
  getCertificate: vi.fn(() => mockedCertificate),
}));
vi.mock('@/data/api/database/database.api', () => ({
  getServiceDatabases: vi.fn(() => [mockedDatabase]),
}));
vi.mock('@/data/api/database/user.api', () => ({
  getUsers: vi.fn(() => [mockedUser]),
}));

describe('InfoConnectionPool', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      poolId: mockedConnectionPool.id,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the dialog with the correct information', async () => {
    render(<InfoConnectionPool />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('info-pools-modal')).toBeInTheDocument();
      expect(screen.getByTestId('info-pools-container')).toBeInTheDocument();
    });

    expect(screen.getByText(mockedDatabase.name)).toBeInTheDocument();
    expect(screen.getByText(mockedConnectionPool.port)).toBeInTheDocument();
    expect(screen.getByText(mockedConnectionPool.sslMode)).toBeInTheDocument();
    expect(screen.getByText(mockedConnectionPool.mode)).toBeInTheDocument();
    expect(screen.getByText(mockedConnectionPool.size)).toBeInTheDocument();
  });

  it('should navigate back if no connection pool is found', async () => {
    vi.mocked(connectionPoolApi.getConnectionPools).mockResolvedValueOnce([]);
    render(<InfoConnectionPool />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('../');
    });
  });

  it('should show a skeleton if data is loading', () => {
    vi.mocked(connectionPoolApi.getConnectionPools).mockResolvedValueOnce([]);
    render(<InfoConnectionPool />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getAllByTestId('dialog-container').length).toBeGreaterThan(0);
  });
});
