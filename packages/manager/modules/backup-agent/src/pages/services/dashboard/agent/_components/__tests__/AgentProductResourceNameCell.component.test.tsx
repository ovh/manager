import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockAgents } from '@/mocks/agents/agents';

import { AgentProductResourceNameCell } from '../AgentProductResourceNameCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
}));

describe('AgentProductResourceNameCell', () => {
  it('renders link with targetSpec.productResourceName as label', () => {
    const agent = mockAgents[0]!.currentState;

    render(<AgentProductResourceNameCell productResourceName={agent.productResourceName} />);

    const cell = screen.getByTestId('cell');
    expect(cell).toHaveTextContent(agent.productResourceName);
  });
});
