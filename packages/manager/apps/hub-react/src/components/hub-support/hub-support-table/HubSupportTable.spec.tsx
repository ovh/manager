import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Ticket } from '@/types/support.type';
import { HubSupportTable } from './HubSupportTable.component';

vi.mock('./hub-support-table-item/HubSupportTableItem.component', () => ({
  HubSupportTableItem: ({ ticket }: { ticket: Ticket }) => (
    <tr data-testid={`support-item-${ticket.ticketId}`}>
      <td>{ticket.ticketId}</td>
    </tr>
  ),
}));

describe('HubSupportTable Component', () => {
  it('renders a table with a maximum of 2 support items', () => {
    const tickets: Ticket[] = [
      {
        ticketId: '1',
        serviceName: 'service 1',
        state: 'state 1',
        subject: 'subject 1',
      },
      {
        ticketId: '2',
        serviceName: 'service 2',
        state: 'state 2',
        subject: 'subject 2',
      },
      {
        ticketId: '3',
        serviceName: 'service 3',
        state: 'state 3',
        subject: 'subject 3',
      },
    ];

    render(<HubSupportTable tickets={tickets} />);

    expect(screen.getByTestId('support-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('support-item-2')).toBeInTheDocument();
    expect(screen.queryByTestId('support-item-3')).not.toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table.querySelectorAll('tr')).toHaveLength(2);
  });
});
