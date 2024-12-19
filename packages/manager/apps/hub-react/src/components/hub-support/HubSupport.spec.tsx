import React, { ReactNode } from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HubSupport from '@/components/hub-support/HubSupport.component';
import '@testing-library/jest-dom';
import { Ticket } from '@/types/support.type';

const { fetch, apiResponse } = vi.hoisted(() => {
  return {
    fetch: {
      isFetched: true,
      isLoading: false,
      error: false,
      refetch: vi.fn(),
    },
    apiResponse: {
      data: {
        count: 3,
        data: [],
      },
      status: 'OK',
    },
  };
});

vi.mock('../skeletons/Skeletons.component', () => ({
  Skeletons: () => <div data-testid="tile-skeleton"></div>,
}));

vi.mock('./hub-support-table/HubSupportTable.component', () => ({
  HubSupportTable: ({ tickets }: { tickets: Ticket[] }) => (
    <div data-testid="hub-support-table"></div>
  ),
}));

vi.mock('../tile-error/TileError.component', () => ({
  default: () => <div data-testid="tile-error"></div>,
}));

vi.mock('./hub-support-help/HubSupportHelp.component', () => ({
  HubSupportHelp: () => <div data-testid="hub-support-help"></div>,
}));

vi.mock('@/data/hooks/apiHubSupport/useHubSupport', () => ({
  useFetchHubSupport: vi.fn(() => {
    return {
      ...fetch,
      ...apiResponse,
    };
  }),
}));

const mocks = vi.hoisted(() => ({
  environment: {
    getRegion: vi.fn(),
    getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
  },
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('mocked-url'),
    },
  },
}));

const queryClient = new QueryClient();
const renderComponent = (component: ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    shell: mocks.shell,
    environment: mocks.environment,
  }),
  PageLocation: {
    datagrid: 'datagrid',
  },
  ButtonType: {
    link: 'link',
  },
}));

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve(apiResponse);
  });
  return {
    apiClient: {
      aapi: {
        get,
      },
    },
  };
});

describe('HubSupport Component', () => {
  it('renders correctly with data for EU', async () => {
    mocks.environment.getRegion.mockReturnValue('EU');

    renderComponent(<HubSupport />);

    const seeMoreLink = screen.getByText('hub_support_see_more');
    expect(seeMoreLink).toBeInTheDocument();

    const osdsLinkElement = seeMoreLink.closest('osds-link');
    expect(osdsLinkElement).not.toBeNull();
    expect(osdsLinkElement).toHaveAttribute(
      'href',
      'https://help.ovhcloud.com/csm?id=csm_cases_requests&spa=1&table=sn_customerservice_case&filter=active%3Dtrue&p=1&o=sys_updated_on&d=desc&ovhSubsidiary=FR',
    );
    expect(osdsLinkElement).toHaveAttribute('target', '_blank');
    expect(osdsLinkElement).toHaveAttribute('rel', 'noreferrer');
    const hubSupportTable = screen.getByTestId('hub-support-table');
    expect(hubSupportTable).toBeInTheDocument();
  });

  it('renders correctly with data for US', async () => {
    mocks.environment.getRegion.mockReturnValue('US');

    renderComponent(<HubSupport />);

    await waitFor(() => {
      const seeMoreLink = screen.getByText('hub_support_see_more');
      expect(seeMoreLink).toBeInTheDocument();

      const osdsLinkElement = seeMoreLink.closest('osds-link');
      expect(osdsLinkElement).not.toBeNull();
      expect(osdsLinkElement).toHaveAttribute('href', 'mocked-url');
      expect(osdsLinkElement).toHaveAttribute('target', '_self');
      const hubSupportTable = screen.getByTestId('hub-support-table');
      expect(hubSupportTable).toBeInTheDocument();
    });
  });

  it('calls refetch on refresh icon click', async () => {
    renderComponent(<HubSupport />);

    const refreshIcon = screen.getByTestId('refresh-icon');
    expect(refreshIcon).toBeInTheDocument();
    expect(fetch.refetch).toBeDefined();
    await act(() => fireEvent.click(refreshIcon));
    expect(fetch.refetch).toHaveBeenCalled();
  });

  it('displays loading skeleton when isLoading is true', () => {
    fetch.isLoading = true;

    renderComponent(<HubSupport />);

    const skeleton = screen.getByTestId('tile-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('displays HubSupportHelp when there are no tickets and loading is false', () => {
    fetch.isLoading = false;
    apiResponse.data.count = 0;

    renderComponent(<HubSupport />);

    const helpHubSupport = screen.getByTestId('hub-support-help');
    expect(helpHubSupport).toBeInTheDocument();
  });

  it('displays TileError when there is an error', () => {
    fetch.error = true;

    renderComponent(<HubSupport />);

    const helpHubSupport = screen.getByTestId('tile-error');
    expect(helpHubSupport).toBeInTheDocument();
  });

  it('displays TileError when API respond a 200 with an error', () => {
    apiResponse.status = 'ERROR';
    renderComponent(<HubSupport />);

    const helpHubSupport = screen.getByTestId('tile-error');
    expect(helpHubSupport).toBeInTheDocument();
  });
});
