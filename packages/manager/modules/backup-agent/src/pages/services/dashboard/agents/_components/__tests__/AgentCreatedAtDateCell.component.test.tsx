import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AgentCreatedAtDateCell } from '../AgentCreatedAtDateCell.component';

const { formatDateMock, useFormatDateMock } = vi.hoisted(() => {
  return {
    useFormatDateMock: vi.fn(),
    formatDateMock: vi.fn().mockImplementation(() => () => '01/01/1970')
  };
});


vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
  useFormatDate: useFormatDateMock,
}));

describe('AgentCreatedAtDateCell', () => {
  it('renders created date formatted well', () => {
    useFormatDateMock.mockImplementation(formatDateMock);
    const myDate = 'my-date'

    render(<AgentCreatedAtDateCell date={myDate} />);

    expect(formatDateMock).toBeCalled();

    expect(screen.getByText('01/01/1970')).toBeVisible();
  });
});
