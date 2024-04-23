import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as logsHook from '@/hooks/api/logs.api.hooks';
import Logs, {
  breadcrumb as LogsBreadcrumb,
} from '@/pages/services/[serviceId]/logs';
import { database } from '@/models/database';
import { Locale } from '@/hooks/useLocale';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

const mockService: database.Service = {
  engine: database.EngineEnum.mongodb,
  id: 'serviceId',
  capabilities: {},
  category: database.CategoryEnum.operational,
  createdAt: '',
  description: '',
  endpoints: [],
  backupTime: '',
  disk: {
    size: 0,
    type: '',
  },
  nodeNumber: 0,
  flavor: '',
  ipRestrictions: [],
  maintenanceTime: '',
  networkType: database.NetworkTypeEnum.private,
  nodes: [],
  plan: '',
  status: database.StatusEnum.READY,
  version: '',
  backups: {
    regions: [],
    time: '',
  },
};

// Mock necessary hooks and dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/hooks/api/logs.api.hooks', () => {
  const useGetServiceLogs = vi.fn();
  return {
    useGetServiceLogs,
  };
});

vi.mock('@/pages/services/[serviceId]/layout', () => {
  const useServiceData = vi.fn(() => ({
    projectId: 'projectId',
    service: mockService,
    category: 'operational',
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  }));
  return {
    useServiceData,
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', () => {
  return {
    useShell: vi.fn(() => ({
      i18n: {
        getLocale: vi.fn(() => Locale.fr_FR),
        onLocaleChange: vi.fn(),
        setLocale: vi.fn(),
      },
    })),
  };
});
describe('Logs component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders and shows skeletons while loading', async () => {
    vi.mocked(logsHook.useGetServiceLogs).mockResolvedValue({
      data: [],
      isSuccess: false,
    } as UseQueryResult<database.service.LogEntry[], Error>);
    render(<Logs />, { wrapper: QueryClientWrapper });
    expect(screen.getByTestId('skeleton-container')).toBeInTheDocument();
  });

  it('displays logs after fetching', async () => {
    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
    vi.mocked(logsHook.useGetServiceLogs).mockReturnValue({
      isSuccess: true,
      data: [
        { timestamp: 1609459200, hostname: 'host1', message: 'Test log 1' },
        { timestamp: 1609459260, hostname: 'host2', message: 'Test log 2' },
      ],
    } as UseQueryResult<database.service.LogEntry[], Error>);
    render(<Logs />, { wrapper: QueryClientWrapper });
    // Wait for logs to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test log 1')).toBeInTheDocument();
      expect(screen.getByText('Test log 2')).toBeInTheDocument();
      expect(mockScrollIntoView).toHaveBeenCalled();
    });
  });

  it('updates auto-refresh status when switch is toggled', async () => {
    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
    vi.mocked(logsHook.useGetServiceLogs).mockReturnValue({
      isSuccess: true,
      data: [
        { timestamp: 1609459200, hostname: 'host1', message: 'Test log 1' },
        { timestamp: 1609459260, hostname: 'host2', message: 'Test log 2' },
      ],
    } as UseQueryResult<database.service.LogEntry[], Error>);
    render(<Logs />, { wrapper: QueryClientWrapper });
    const switchElement = screen.getByRole('switch');
    // Toggle switch
    fireEvent.click(switchElement);
    // Assert it's checked
    expect(switchElement).toBeChecked();
  });

  it('should display the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<LogsBreadcrumb />);
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });
});
