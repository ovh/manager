import { OsdsChip, OsdsLink } from '@ovhcloud/ods-components/react';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { Ticket } from '@/types/support.type';
import { SUPPORT_URLS } from '../../HubSupport.constants';

type Props = {
  ticket: Ticket;
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

  useEffect(() => {
    (async () => {
      const linkResult: string = isEUOrCA
        ? SUPPORT_URLS.viewTicket.replace('{ticketId}', ticket.ticketId) +
          ovhSubsidiary
        : ((await navigation.getURL(
            'dedicated',
            `#/support/tickets/${ticket.ticketId}`,
            {},
          )) as string);

      setUrl(linkResult);
    })();
  }, [ticket.ticketId]);

  const handleClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['activity', 'assistance', 'go-to-ticket'],
    });
  };

  return (
    <tr key={ticket.ticketId}>
      <th scope="row" className="!font-bold">
        {ticket.serviceName}
      </th>
      <th scope="row">{ticket.subject}</th>
      <th scope="row">
        <OsdsChip size={ODS_CHIP_SIZE.sm} color={stateColor} inline>
          {t(`hub_support_state_${ticket.state}`)}
        </OsdsChip>
      </th>
      <th scope="row" className="text-right">
        <OsdsLink
          href={url}
          onClick={handleClick}
          target={
            isEUOrCA
              ? OdsHTMLAnchorElementTarget._blank
              : OdsHTMLAnchorElementTarget._self
          }
          rel={isEUOrCA ? OdsHTMLAnchorElementRel.noreferrer : undefined}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="font-bold text-right"
        >
          {t('hub_support_read')}
        </OsdsLink>
      </th>
    </tr>
  );
};
