import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DataGridTextCellMock } from '@/test-utils/mocks/manager-react-components';
import { useTranslationMock } from '@/test-utils/mocks/react-i18next';

import { AgentPolicyCell } from '../AgentPolicyCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: DataGridTextCellMock,
}));

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: useTranslationMock,
}));

describe('AgentNameCell', () => {
  it.each([{ policy: 'my policy' }])('renders policy $expected', async ({ policy }) => {
    const { container } = render(<AgentPolicyCell policy={policy} />);

    expect(screen.getByText(policy)).toBeVisible();

    await expect(container).toBeAccessible();
  });
});
