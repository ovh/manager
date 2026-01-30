import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockAgents } from '@/mocks/agents/agents';
import { DataGridTextCellMock } from '@/test-utils/mocks/manager-react-components';

import { AgentNameCell } from '../AgentNameCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: DataGridTextCellMock,
}));

describe('AgentNameCell', () => {
  it('renders link with targetSpec.name as label and default href', () => {
    const agent = mockAgents[0]!.currentState;

    render(<AgentNameCell name={agent.name} />);

    const cell = screen.getByTestId('cell');
    expect(cell).toHaveTextContent(agent.name);
  });
});
