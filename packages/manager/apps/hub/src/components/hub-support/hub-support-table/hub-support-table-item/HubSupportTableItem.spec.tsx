import React from 'react';

import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { SupportTicketRow } from '@/types/support.type';

import { HubSupportTableItem } from './HubSupportTableItem.component';

const trackClickMock = vi.fn();

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
  useOvhTracking: () => ({ trackClick: trackClickMock }),
  PageLocation: {
    datagrid: 'datagrid',
  },
  ButtonType: {
    link: 'link',
  },
}));

/** Row as built from 2api `/hub/support`. */
const hubSupportRow: SupportTicketRow = {
  key: '123',
  label: 'Service A',
  subject: 'Subject A',
  state: 'open',
  ticketId: '123',
};

/** Row as built from apiv6 `/support/conversation`. */
const conversationRow: SupportTicketRow = {
  key: 'a1b2c3d4-e5f6-4711-8899-aabbccddeeff',
  label: '#CS123',
  subject: 'Subject A',
  state: 'open',
  ticketId: 'CS123',
  conversationId: 'a1b2c3d4-e5f6-4711-8899-aabbccddeeff',
};

describe('HubSupportTableItem Component', () => {
  beforeEach(() => {
    mocks.environment.getUser.mockReturnValue({ ovhSubsidiary: 'GB' });
  });

  it('renders support information correctly for EU region', async () => {
    mocks.environment.getRegion.mockReturnValue('EU');

    render(<HubSupportTableItem ticket={hubSupportRow} />);

    expect(screen.getByText(hubSupportRow.label)).toBeInTheDocument();
    expect(screen.getByText(hubSupportRow.subject)).toBeInTheDocument();
    expect(screen.getByText('hub_support_state_open')).toBeInTheDocument();
    await screen.findByText('hub_support_read');
    const osdsLinkElement = screen.getByText('hub_support_read').closest('osds-link');
    expect(osdsLinkElement).toHaveAttribute(
      'href',
      'https://help.ovhcloud.com/csm?id=csm_ticket&table=sn_customerservice_case&number=CS123&view=csp&ovhSubsidiary=GB',
    );
    expect(osdsLinkElement).toHaveAttribute('target', '_blank');
    expect(osdsLinkElement).toHaveAttribute('rel', 'noreferrer');
  });

  it('links to the Digital Agent conversation for FR customers on EU', async () => {
    mocks.environment.getRegion.mockReturnValue('EU');
    mocks.environment.getUser.mockReturnValue({ ovhSubsidiary: 'FR' });

    render(<HubSupportTableItem ticket={conversationRow} />);

    expect(screen.getByText('#CS123')).toBeInTheDocument();

    await waitFor(() => {
      const osdsLinkElement = screen.getByText('hub_support_read').closest('osds-link');
      expect(osdsLinkElement).toHaveAttribute(
        'href',
        `/beta/#/support/digital-agent/${conversationRow.conversationId}`,
      );
      expect(osdsLinkElement).toHaveAttribute('target', '_top');
      expect(osdsLinkElement).not.toHaveAttribute('rel');
    });
  });

  it('falls back to the Digital Agent ticket list, never to the help center', async () => {
    mocks.environment.getRegion.mockReturnValue('EU');
    mocks.environment.getUser.mockReturnValue({ ovhSubsidiary: 'FR' });

    render(<HubSupportTableItem ticket={{ ...conversationRow, conversationId: undefined }} />);

    await waitFor(() => {
      const osdsLinkElement = screen.getByText('hub_support_read').closest('osds-link');
      expect(osdsLinkElement).toHaveAttribute('href', '/beta/#/support/tickets?type=ticket');
      expect(osdsLinkElement).toHaveAttribute('target', '_top');
      expect(osdsLinkElement.getAttribute('href')).not.toContain('help.ovhcloud.com');
    });
  });

  it('renders support information correctly for US region', async () => {
    mocks.environment.getRegion.mockReturnValue('US');

    render(<HubSupportTableItem ticket={hubSupportRow} />);

    await screen.findByText('hub_support_read');
    await waitFor(() => {
      const osdsLinkElement = screen.getByText('hub_support_read').closest('osds-link');
      expect(osdsLinkElement).toHaveAttribute('href', 'mocked-url');
      expect(osdsLinkElement).toHaveAttribute('target', '_self');
      expect(osdsLinkElement).not.toHaveAttribute('rel');
      expect(screen.getByText(hubSupportRow.label)).toBeInTheDocument();
      expect(screen.getByText(hubSupportRow.subject)).toBeInTheDocument();
      expect(screen.getByText('hub_support_state_open')).toBeInTheDocument();
    });
  });

  it('calls trackClick on link click', async () => {
    mocks.environment.getRegion.mockReturnValue('EU');

    render(<HubSupportTableItem ticket={hubSupportRow} />);

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

  it('applies correct color based on support state', () => {
    mocks.environment.getRegion.mockReturnValue('EU');

    render(<HubSupportTableItem ticket={{ ...hubSupportRow, state: 'closed' }} />);

    const chip = screen.getByText('hub_support_state_closed');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.info);
  });
});
