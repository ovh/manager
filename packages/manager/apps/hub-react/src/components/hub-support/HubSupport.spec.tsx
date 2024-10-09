import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HubSupport from '@/components/hub-support/HubSupport.component';
import '@testing-library/jest-dom';
import { Ticket } from '@/types/support.type';

const { refetch } = vi.hoisted(() => {
  return { refetch: vi.fn() };
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

const useFetchMockValue: any = {
  data: { count: 3, data: [] },
  isFetched: true,
  isLoading: false,
  refetch,
};

vi.mock('@/data/hooks/apiHubSupport/useHubSupport', () => ({
  useFetchHubSupport: vi.fn(() => useFetchMockValue),
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

describe('HubSupport Component', () => {
  it('renders correctly with data for EU', async () => {
    mocks.environment.getRegion.mockReturnValue('EU');

    render(<HubSupport />);

    const seeMoreLink = screen.getByText('hub_support_see_all');
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

    render(<HubSupport />);

    await waitFor(() => {
      const seeMoreLink = screen.getByText('hub_support_see_all');
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
    render(<HubSupport />);

    const refreshIcon = screen.getByTestId('refresh-icon');
    expect(refreshIcon).toBeInTheDocument();
    expect(refetch).toBeDefined();
    await act(() => fireEvent.click(refreshIcon));
    expect(refetch).toHaveBeenCalled();
  });

  it('displays loading skeleton when isLoading is true', () => {
    useFetchMockValue.isLoading = true;
    useFetchMockValue.data = undefined;

    render(<HubSupport />);

    const skeleton = screen.getByTestId('tile-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('displays HubSupportHelp when there are no tickets and loading is false', () => {
    useFetchMockValue.isLoading = false;
    useFetchMockValue.data = { count: 0, data: [] };

    render(<HubSupport />);

    const helpHubSupport = screen.getByTestId('hub-support-help');
    expect(helpHubSupport).toBeInTheDocument();
  });

  it('displays TileError when there is an error', () => {
    useFetchMockValue.error = true;

    render(<HubSupport />);

    const helpHubSupport = screen.getByTestId('tile-error');
    expect(helpHubSupport).toBeInTheDocument();
  });
});
