import React from 'react';

import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HubSupport from '@/components/hub-support/HubSupport.component';
import { SupportTicketRow } from '@/types/support.type';

const { refetch } = vi.hoisted(() => {
  return { refetch: vi.fn() };
});

vi.mock('../skeletons/Skeletons.component', () => ({
  Skeletons: () => <div data-testid="tile-skeleton"></div>,
}));

vi.mock('./hub-support-table/HubSupportTable.component', () => ({
  HubSupportTable: ({ maxTickets }: { tickets: SupportTicketRow[]; maxTickets: number }) => (
    <div data-testid="hub-support-table" data-max-tickets={maxTickets}></div>
  ),
}));

vi.mock('../tile-error/TileError.component', () => ({
  default: () => <div data-testid="tile-error"></div>,
}));

vi.mock('./hub-support-help/HubSupportHelp.component', () => ({
  HubSupportHelp: () => <div data-testid="hub-support-help"></div>,
}));

const useFetchMockValue = {
  isDigitalAgent: false,
  tickets: [] as SupportTicketRow[],
  count: 3,
  isLoading: false,
  error: false as unknown,
  refetch,
};

vi.mock('@/data/hooks/hubSupportTickets/useHubSupportTickets', () => ({
  useHubSupportTickets: vi.fn(() => useFetchMockValue),
}));

const mocks = vi.hoisted(() => ({
  environment: {
    getRegion: vi.fn(),
    getUser: vi.fn(() => ({ ovhSubsidiary: 'GB' })),
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
  beforeEach(() => {
    mocks.environment.getUser.mockReturnValue({ ovhSubsidiary: 'GB' });
    useFetchMockValue.isDigitalAgent = false;
    useFetchMockValue.count = 3;
    useFetchMockValue.isLoading = false;
    useFetchMockValue.error = false;
  });

  it('renders correctly with data for EU', () => {
    mocks.environment.getRegion.mockReturnValue('EU');

    render(<HubSupport />);

    const seeMoreLink = screen.getByText('hub_support_see_more');
    expect(seeMoreLink).toBeInTheDocument();

    const osdsLinkElement = seeMoreLink.closest('osds-link');
    expect(osdsLinkElement).not.toBeNull();
    expect(osdsLinkElement).toHaveAttribute(
      'href',
      'https://help.ovhcloud.com/csm?id=csm_cases_requests&spa=1&table=sn_customerservice_case&filter=active%3Dtrue&p=1&o=sys_updated_on&d=desc&ovhSubsidiary=GB',
    );
    expect(osdsLinkElement).toHaveAttribute('target', '_blank');
    expect(osdsLinkElement).toHaveAttribute('rel', 'noreferrer');
    const hubSupportTable = screen.getByTestId('hub-support-table');
    expect(hubSupportTable).toBeInTheDocument();
    expect(hubSupportTable).toHaveAttribute('data-max-tickets', '2');
  });

  it('points "see all" to the Digital Agent tickets for FR customers on EU', async () => {
    mocks.environment.getRegion.mockReturnValue('EU');
    mocks.environment.getUser.mockReturnValue({ ovhSubsidiary: 'FR' });
    useFetchMockValue.isDigitalAgent = true;

    render(<HubSupport />);

    await waitFor(() => {
      const osdsLinkElement = screen.getByText('hub_support_see_more').closest('osds-link');
      expect(osdsLinkElement).toHaveAttribute('href', '/beta/#/support/tickets?type=ticket');
      expect(osdsLinkElement).toHaveAttribute('target', '_top');
      expect(osdsLinkElement).not.toHaveAttribute('rel');
      expect(screen.getByTestId('hub-support-table')).toHaveAttribute('data-max-tickets', '4');
    });
  });

  it('renders correctly with data for US', async () => {
    mocks.environment.getRegion.mockReturnValue('US');

    render(<HubSupport />);

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
    render(<HubSupport />);

    const refreshIcon = screen.getByTestId('refresh-icon');
    expect(refreshIcon).toBeInTheDocument();
    expect(refetch).toBeDefined();
    await act(() => fireEvent.click(refreshIcon));
    expect(refetch).toHaveBeenCalled();
  });

  it('displays loading skeleton when isLoading is true', () => {
    useFetchMockValue.isLoading = true;

    render(<HubSupport />);

    const skeleton = screen.getByTestId('tile-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('displays HubSupportHelp when there are no tickets and loading is false', () => {
    useFetchMockValue.isLoading = false;
    useFetchMockValue.count = 0;

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

  it('should have a valid html', () => {
    const { container } = render(<HubSupport />);
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });
});
