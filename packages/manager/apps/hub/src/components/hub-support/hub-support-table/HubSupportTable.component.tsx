import React, { FunctionComponent } from 'react';

import { OsdsTable } from '@ovhcloud/ods-components/react';

import { SupportTicketRow } from '@/types/support.type';

import { HubSupportTableItem } from './hub-support-table-item/HubSupportTableItem.component';

type Props = {
  tickets: SupportTicketRow[];
  /** Source dependent, see the MAX_*_TO_DISPLAY constants. */
  maxTickets: number;
};

export const HubSupportTable: FunctionComponent<Props> = ({ tickets, maxTickets }) => {
  const limitedTickets = tickets.slice(0, maxTickets);
  return (
    <OsdsTable className="block">
      <table className="table-auto">
        <tbody>
          {limitedTickets.map((ticketItem) => (
            <HubSupportTableItem key={ticketItem.key} ticket={ticketItem} />
          ))}
        </tbody>
      </table>
    </OsdsTable>
  );
};
