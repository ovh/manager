import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementRel, OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip, OsdsLink } from '@ovhcloud/ods-components/react';

import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { SupportTicketRow } from '@/types/support.type';
import { isDigitalAgentEnabled } from '@/utils/digitalAgent';

import { DIGITAL_AGENT_URLS, SUPPORT_URLS } from '../../HubSupport.constants';

type Props = {
  ticket: SupportTicketRow;
};

/**
 * The Digital Agent lives in the Manager V7, outside of the hub iframe, hence
 * `_top`. Help Center links stay external, V6 tickets stay in the iframe.
 */
const getTicketLinkTarget = (isDigitalAgent: boolean, isEUOrCA: boolean) => {
  if (isDigitalAgent) return OdsHTMLAnchorElementTarget._top;
  return isEUOrCA ? OdsHTMLAnchorElementTarget._blank : OdsHTMLAnchorElementTarget._self;
};

export const HubSupportTableItem: FunctionComponent<Props> = ({ ticket }) => {
  const { t } = useTranslation('hub/support');

  // The switch case below is superfluous as the API only returns open tickets.
  // Since all tickets have the state 'open', all switch cases except 'open' will never be reached.
  const stateColor: ODS_THEME_COLOR_INTENT = useMemo(() => {
    switch (ticket.state) {
      case 'open':
        return ODS_THEME_COLOR_INTENT.success;
      case 'closed':
        return ODS_THEME_COLOR_INTENT.info;
      case 'unknown':
        return ODS_THEME_COLOR_INTENT.warning;
      default:
        return ODS_THEME_COLOR_INTENT.error;
    }
  }, [ticket]);

  const context = useContext(ShellContext);
  const {
    shell: { navigation },
    environment,
  } = context;
  const { ovhSubsidiary } = environment.getUser();
  const { trackClick } = useOvhTracking();
  const region = environment.getRegion();

  const [url, setUrl] = useState<string>('');

  const isEUOrCA = ['EU', 'CA'].includes(region);
  const isDigitalAgent = isDigitalAgentEnabled(region, ovhSubsidiary);

  const { conversationId } = ticket;

  useEffect(() => {
    void (async () => {
      if (isDigitalAgent) {
        // Never send a FR customer back to the Help Center: when the
        // conversation id is not resolved (yet), open the Digital Agent ticket
        // list rather than the CSM page.
        setUrl(
          conversationId
            ? DIGITAL_AGENT_URLS.viewTicket.replace(
                '{conversationId}',
                encodeURIComponent(conversationId),
              )
            : DIGITAL_AGENT_URLS.allTickets,
        );
        return;
      }

      const linkResult: string = isEUOrCA
        ? SUPPORT_URLS.viewTicket.replace('{ticketId}', ticket.ticketId) + ovhSubsidiary
        : ((await navigation.getURL(
            'dedicated',
            `#/support/tickets/${ticket.ticketId}`,
            {},
          )) as string);

      setUrl(linkResult);
    })();
  }, [ticket.ticketId, isDigitalAgent, conversationId]);

  const handleClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['activity', 'assistance', 'go-to-ticket'],
    });
  };

  return (
    <tr key={ticket.key}>
      <th scope="row" className="break-all !font-bold">
        {ticket.label}
      </th>
      <th scope="row">{ticket.subject}</th>
      <th scope="row" className="!min-w-min">
        <OsdsChip size={ODS_CHIP_SIZE.sm} color={stateColor} inline>
          {t(`hub_support_state_${ticket.state}`)}
        </OsdsChip>
      </th>
      <th scope="row" className="!min-w-min text-right">
        <OsdsLink
          href={url}
          onClick={handleClick}
          target={getTicketLinkTarget(isDigitalAgent, isEUOrCA)}
          rel={isEUOrCA && !isDigitalAgent ? OdsHTMLAnchorElementRel.noreferrer : undefined}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="text-right font-bold"
        >
          {t('hub_support_read')}
        </OsdsLink>
      </th>
    </tr>
  );
};
