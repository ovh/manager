import { OsdsTable } from '@ovhcloud/ods-components/react';
import React, { FunctionComponent } from 'react';
import { Ticket } from '@/types/support.type';
import { MAX_TICKETS_TO_DISPLAY } from '../HubSupport.constants';
import { HubSupportTableItem } from './hub-support-table-item/HubSupportTableItem.component';

type Props = {
  tickets: Ticket[];
};

export const HubSupportTable: FunctionComponent<Props> = ({ tickets }) => {
  // This code below is superfluous because the API always returns only 2 tickets.
  const limitedTickets = tickets.slice(0, MAX_TICKETS_TO_DISPLAY);
  return (
    <OsdsTable className="block">
      <table className="table-auto">
        <tbody>
          {limitedTickets.map((ticketItem) => (
            <HubSupportTableItem
              key={ticketItem.ticketId}
              ticket={ticketItem}
            />
          ))}
        </tbody>
      </table>
    </OsdsTable>
  );
};
