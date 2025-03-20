import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Ticket } from '@/types/support.type';
import { HubSupportTableItem } from './HubSupportTableItem.component';

const trackClickMock = vi.fn();

const mocks = vi.hoisted(() => ({
  environment: {
    getRegion: vi.fn(),
    getUser: () => ({ ovhSubsidiary: 'FR' }),
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
  useOvhTracking: () => ({ trackClick: trackClickMock }),
  PageLocation: {
    datagrid: 'datagrid',
  },
  ButtonType: {
    link: 'link',
  },
}));

const mockTicket: Ticket = {
  ticketId: '123',
  serviceName: 'Service A',
  subject: 'Subject A',
  state: 'open',
};

describe('HubSupportTableItem Component', () => {
  it('renders support information correctly for EU region', async () => {
    mocks.environment.getRegion.mockReturnValue('EU');

    render(<HubSupportTableItem ticket={mockTicket} />);

    expect(screen.getByText(mockTicket.serviceName)).toBeInTheDocument();
    expect(screen.getByText(mockTicket.subject)).toBeInTheDocument();
    expect(screen.getByText('hub_support_state_open')).toBeInTheDocument();
    await screen.findByText('hub_support_read');
    const osdsLinkElement = screen
      .getByText('hub_support_read')
      .closest('osds-link');
    expect(osdsLinkElement).toHaveAttribute(
      'href',
      'https://help.ovhcloud.com/csm?id=csm_ticket&table=sn_customerservice_case&number=CS123&view=csp&ovhSubsidiary=FR',
    );
    expect(osdsLinkElement).toHaveAttribute('target', '_blank');
    expect(osdsLinkElement).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders support information correctly for US region', async () => {
    mocks.environment.getRegion.mockReturnValue('US');

    render(<HubSupportTableItem ticket={mockTicket} />);

    await screen.findByText('hub_support_read');
    await waitFor(() => {
      const osdsLinkElement = screen
        .getByText('hub_support_read')
        .closest('osds-link');
      expect(osdsLinkElement).toHaveAttribute('href', 'mocked-url');
      expect(osdsLinkElement).toHaveAttribute('target', '_self');
      expect(osdsLinkElement).not.toHaveAttribute('rel');
      expect(screen.getByText(mockTicket.serviceName)).toBeInTheDocument();
      expect(screen.getByText(mockTicket.subject)).toBeInTheDocument();
      expect(screen.getByText('hub_support_state_open')).toBeInTheDocument();
    });
  });

  it('calls trackClick on link click', async () => {
    mocks.environment.getRegion.mockReturnValue('EU');

    render(<HubSupportTableItem ticket={mockTicket} />);

    const linkElement = screen.getByText('hub_support_read');
    expect(linkElement).toBeInTheDocument();

    await act(() => fireEvent.click(linkElement));

    expect(trackClickMock).toHaveBeenCalledWith({
      location: 'datagrid',
      buttonType: 'link',
      actionType: 'navigation',
      actions: ['activity', 'assistance', 'go-to-ticket'],
    });
  });

  it('applies correct color based on support state', async () => {
    mocks.environment.getRegion.mockReturnValue('EU');

    render(<HubSupportTableItem ticket={{ ...mockTicket, state: 'closed' }} />);

    const chip = screen.getByText('hub_support_state_closed');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.info);
  });
});
