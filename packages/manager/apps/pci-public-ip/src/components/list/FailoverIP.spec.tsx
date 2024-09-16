import * as managerComponentsModule from '@ovh-ux/manager-react-components';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';

import { render } from '@testing-library/react';
import { describe, vi } from 'vitest';
import * as useFailoverModule from '@/api/hooks/useFailoverIP';
import FailoverIPComponent, {
  FailoverIPComponentProps,
} from './FailoverIP.component';

type TData = {
  rows: {
    associatedEntityName: string;
    block: string;
    continentCode: string;
    geoloc: string;
    id: string;
    ip: string;
    progress: number;
    routedTo: string;
    status: string;
    subType: string;
  }[];
  pageCount: number;
  totalRows: number;
};

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: vi.fn().mockReturnValue(null),
  Datagrid: vi.fn().mockReturnValue(<div>Datagrid</div>),
  FilterAdd: vi.fn().mockReturnValue(null),
  FilterList: vi.fn().mockReturnValue(null),
  Notifications: vi.fn().mockReturnValue(<div>Notifications</div>),
  PciAnnouncementBanner: vi
    .fn()
    .mockReturnValue(<div>PciAnnouncementBanner</div>),
  useColumnFilters: vi.fn().mockReturnValue([]),
  useDatagridSearchParams: vi.fn().mockReturnValue({
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    setPagination: vi.fn(),
    sorting: { desc: false, id: 'id' },
    setSorting: vi.fn(),
  }),
  useFeatureAvailability: vi.fn().mockReturnValue({
    data: {},
    isLoading: false,
  } as managerComponentsModule.UseFeatureAvailabilityResult),
}));

const mockedReactRouterNavigation = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => ({
    navigate: mockedReactRouterNavigation,
  }),
  useLocation: () => ({
    pathname: '/foo',
  }),
  useParams: () => {
    return {
      projectId: 'foo',
    };
  },
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => {
  const navigateTo = vi.fn();
  return {
    useNavigation: () => {
      return {
        navigateTo,
      };
    },
  };
});

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProject: vi.fn(() => ({ data: {} })),
  PciAnnouncementBanner: () => <div>PciAnnouncementBanner</div>,
}));

const renderFailover = (props: FailoverIPComponentProps) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <FailoverIPComponent {...props} />
    </QueryClientProvider>,
  );
};

describe('FailoverIP component tests', () => {
  it('should render notification component', () => {
    const props = {
      projectId: 'project-id-123456',
      projectUrl: 'https://project-url',
    };

    const { container, debug } = renderFailover(props);

    expect(container).toContainHTML('<div>Notifications</div>');
  });

  it('should  display the PciAnnouncementBanner component when displayAnnouncementBanner is true ', () => {
    vi.spyOn(managerComponentsModule, 'useFeatureAvailability').mockReturnValue(
      {
        data: { 'public-cloud:pci-announcement-banner': true },
        isLoading: false,
      } as managerComponentsModule.UseFeatureAvailabilityResult,
    );

    const props = {
      projectId: 'project-id-123456',
      projectUrl: 'https://project-url',
    };

    const { container } = renderFailover(props);

    expect(container).toContainHTML('<div>PciAnnouncementBanner</div>');
  });

  it('should display Error message when error is defined', () => {
    vi.spyOn(useFailoverModule, 'useFailoverIPs').mockReturnValue({
      error: 'there is an error',
    } as UseQueryResult<TData>);

    const props = {
      projectId: 'project-id-123456',
      projectUrl: 'https://project-url',
    };

    const { getByTestId } = renderFailover(props);

    expect(getByTestId('failoverIP_message_error')).toBeInTheDocument();
    expect(getByTestId('failoverIP_message_error')).toBeVisible();
  });

  it('should display loading Spinner when isLoading is true and error is not defined', () => {
    vi.spyOn(useFailoverModule, 'useFailoverIPs').mockReturnValue({
      error: undefined,
      isLoading: true,
    } as UseQueryResult<TData>);

    const props = {
      projectId: 'project-id-123456',
      projectUrl: 'https://project-url',
    };

    const { getByTestId } = renderFailover(props);

    expect(getByTestId('failoverIP_spinner_loading')).toBeInTheDocument();
    expect(getByTestId('failoverIP_spinner_loading')).toBeVisible();
  });

  it('should display dataGrid component Spinner when isLoading is false and error is not defined', () => {
    vi.spyOn(useFailoverModule, 'useFailoverIPs').mockReturnValue({
      data: {
        pageCount: 2,
        totalRows: 20,
        rows: [],
      },
      error: undefined,
      isLoading: false,
    } as UseQueryResult<TData>);

    const props = {
      projectId: 'project-id-123456',
      projectUrl: 'https://project-url',
    };

    const { container } = renderFailover(props);

    expect(container).toContainHTML('<div>Datagrid</div>');
  });
});
