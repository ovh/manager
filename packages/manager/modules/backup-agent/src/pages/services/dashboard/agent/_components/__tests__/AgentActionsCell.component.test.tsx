import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { mockAgents } from '@/mocks/agents/agents';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { AgentActionsCell } from '@/pages/services/dashboard/agent/_components/AgentActionsCell.component';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  const { useHrefMock } = await import('@/test-utils/mocks/react-router-dom');
  return {
    ...actual,
    useHref: useHrefMock,
  };
});

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-components/react')>();
  const { OdsButtonMock } = await import('@/test-utils/mocks/ods-components');
  return {
    ...actual,
    OdsButton: OdsButtonMock,
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  const { ActionMenuMock, DataGridTextCellMock } = await import(
    '@/test-utils/mocks/manager-react-components'
  );

  return {
    ...actual,
    DataGridTextCell: DataGridTextCellMock,
    ActionMenu: ActionMenuMock,
  };
});

vi.mock('react-i18next', async () => {
  const { useTranslationMock } = await import('@/test-utils/mocks/react-i18next');
  return {
    useTranslation: useTranslationMock,
  };
});

describe('AgentActionCell', () => {
  it('renders agent action', () => {
    render(<AgentActionsCell tenantId={mockAgents[0]!.id} agentId={TENANTS_MOCKS[0]!.id} />);

    expect(screen.getByText('translated_configure')).toBeVisible();
    expect(screen.getByText('translated_delete')).toBeVisible();
  });
});
