import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SupportTicketRow } from '@/types/support.type';

import { HubSupportTable } from './HubSupportTable.component';

vi.mock('./hub-support-table-item/HubSupportTableItem.component', () => ({
  HubSupportTableItem: ({ ticket }: { ticket: SupportTicketRow }) => (
    <tr data-testid={`support-item-${ticket.key}`}>
      <td>{ticket.label}</td>
    </tr>
  ),
}));

const tickets: SupportTicketRow[] = [1, 2, 3, 4, 5].map((n) => ({
  key: `${n}`,
  label: `service ${n}`,
  state: `state ${n}`,
  subject: `subject ${n}`,
  ticketId: `${n}`,
}));

describe('HubSupportTable Component', () => {
  it.each([
    ['/hub/support', 2],
    ['the Digital Agent', 4],
  ])('caps the rows at the %s limit', (_source, maxTickets) => {
    render(<HubSupportTable tickets={tickets} maxTickets={maxTickets} />);

    for (let n = 1; n <= maxTickets; n += 1) {
      expect(screen.getByTestId(`support-item-${n}`)).toBeInTheDocument();
    }
    expect(screen.queryByTestId(`support-item-${maxTickets + 1}`)).not.toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table.querySelectorAll('tr')).toHaveLength(maxTickets);
  });
});
