import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
// import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedConnectionPool } from '@/__tests__/helpers/mocks/connectionPool';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';
import InfoConnectionPool from './InfoConnectionPool.modal';
import * as connectionPoolApi from '@/data/api/database/connectionPool.api';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import * as database from '@/types/cloud/project/database';

const mockedCertificate = { ca: 'certificateCA' };
const mockedUsedNavigate = vi.fn();
const downloadMock = vi.fn();
vi.mock('@datatr-ux/uxlib', () => ({
  Skeleton: vi.fn(() => <div data-testid="skeleton" />),
}));

describe('InfoConnectionPool', () => {
  beforeEach(() => {
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
        useParams: () => ({
          projectId: 'projectId',
          category: database.engine.CategoryEnum.all,
          poolId: mockedConnectionPool.id,
        }),
      };
    });
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
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the dialog with the correct information', async () => {
    render(<InfoConnectionPool />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('info-pools-modal')).toBeInTheDocument();
      expect(screen.getByTestId('info-pools-table')).toBeInTheDocument();
    });

    expect(screen.getByText(mockedDatabase.name)).toBeInTheDocument();
    expect(screen.getByText(mockedConnectionPool.port)).toBeInTheDocument();
    expect(screen.getByText(mockedConnectionPool.sslMode)).toBeInTheDocument();
    expect(screen.getByText(mockedConnectionPool.uri)).toBeInTheDocument();
    expect(screen.getByText(mockedConnectionPool.mode)).toBeInTheDocument();
    expect(screen.getByText(mockedConnectionPool.size)).toBeInTheDocument();
  });

  it('should copy the certificate to the clipboard', async () => {
    const writeTextMock = vi.fn();
    Object.assign(window.navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<InfoConnectionPool />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('info-pools-modal')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('info-pools-copy-certificate-action'));
    });

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(mockedCertificate.ca);
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'infoConnectionPoolCertificateCopyToast',
      });
    });
  });

  it('should download the certificate', async () => {
    vi.mock('@/hooks/useDownload', () => ({
      default: vi.fn(() => ({ download: downloadMock })),
    }));

    render(<InfoConnectionPool />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('info-pools-modal')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('info-pools-download-ca-action'));
    });

    await waitFor(() => {
      expect(downloadMock).toHaveBeenCalledWith(mockedCertificate.ca, 'ca.pem');
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'infoConnectionPoolCertificateDownloadToast',
      });
    });
  });

  it('should copy the URI to the clipboard', async () => {
    const writeTextMock = vi.fn();
    Object.assign(window.navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<InfoConnectionPool />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('info-pools-modal')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('info-pools-copy-uri-action'));
    });

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(mockedConnectionPool.uri);
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'infoConnectionPoolUriToast',
      });
    });
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
