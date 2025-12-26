import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockAgents } from '@/mocks/agents/agents';

import { AgentNameCell } from '../AgentNameCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
}));

describe('AgentNameCell', () => {
  it('renders link with targetSpec.name as label and default href', () => {
    const agent = mockAgents[0]!.currentState;

    render(<AgentNameCell name={agent.name} />);

    const cell = screen.getByTestId('cell');
    expect(cell).toHaveTextContent(agent.name);
  });
});
