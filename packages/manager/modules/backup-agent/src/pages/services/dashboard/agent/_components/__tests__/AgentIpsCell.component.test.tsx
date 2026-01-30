import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AgentIpsCell } from '@/pages/services/dashboard/agent/_components/AgentIpsCell.component';

vi.mock('@ovh-ux/manager-react-components', async () => {
  const { DataGridTextCellMock } = await import('@/test-utils/mocks/manager-react-components');
  return {
    DataGridTextCell: DataGridTextCellMock,
  };
});

describe('AgentNameCell', () => {
  it.each([
    { ips: ['1.1.1.1'], expected: '1.1.1.1' },
    { ips: ['1.1.1.1', '2.2.2.2'], expected: '1.1.1.1, 2.2.2.2' },
  ])('renders ips $expected', ({ ips, expected }) => {
    render(<AgentIpsCell ips={ips} />);

    expect(screen.getByText(expected)).toBeVisible();
  });
});
