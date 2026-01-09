import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { mockAgents } from '@/mocks/agents/agents';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { AgentActionsCell } from '@/pages/services/dashboard/agent/_components/AgentActionsCell.component';

vi.mock('react-router-dom', () => ({
  useHref: vi.fn().mockImplementation((url: string) => url),
}));

// --- Mock translation ---
vi.mock('@ovhcloud/ods-components/react', async () => {
  const actual = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...actual,
    OdsButton: vi
      .fn()
      .mockImplementation(({ label }: { children: React.ReactNode; label: string }) => (
        <button>{label}</button>
      )),
  };
});

vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');

  return {
    ...actual,
    DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="cell">{children}</div>
    ),
  };
});

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: vi
    .fn()
    .mockImplementation(() => ({ t: (key: string) => `translated_${key.split(':')[1]}` })),
}));

describe('AgentActionCell', () => {
  it('renders agent action', () => {
    render(<AgentActionsCell tenantId={mockAgents[0]!.id} agentId={TENANTS_MOCKS[0]!.id} />);

    expect(screen.getByText('translated_configure')).toBeVisible();
    expect(screen.getByText('translated_delete')).toBeVisible();
  });
});
