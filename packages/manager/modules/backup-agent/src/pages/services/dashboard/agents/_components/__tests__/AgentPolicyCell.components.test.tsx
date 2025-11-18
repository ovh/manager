import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AgentPolicyCell } from '../AgentPolicyCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: vi
    .fn()
    .mockImplementation(() => ({ t: (key: string) => `translated_${key.split(':')[1]}` })),
}));

describe('AgentNameCell', () => {
  it.each([{ policy: 'my policy' }])('renders policy $expected', async ({ policy }) => {
    const { container } = render(<AgentPolicyCell policy={policy} />);

    expect(screen.getByText(policy)).toBeVisible();

    await expect(container).toBeAccessible();
  });
});
