import React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {AgentActionsCell} from "@/pages/services/dashboard/agents/_components";
import {mockAgents} from "@/mocks/agents/agents";

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
}));

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockImplementation(() => ({t: (key: string) => `translated_${key.split(':')[1]}`})),
}));

describe('AgentActionCell', () => {
  it('renders agent action', async () => {

    const { container } = render(<AgentActionsCell {...mockAgents[0]!} />);

    await expect(container).toBeAccessible();
  });
});
