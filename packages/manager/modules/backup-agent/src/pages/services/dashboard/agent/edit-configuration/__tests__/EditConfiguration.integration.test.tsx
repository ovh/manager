import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { mockAgents } from '@/mocks/agents/agents';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { LABELS } from '@/module.constants';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';

// --- Mock translation ---
vi.mock('@ovhcloud/ods-components/react', async () => {
  const actual = await vi.importActual('@ovhcloud/ods-components/react');

  return {
    ...actual,
    OdsDrawer: vi
      .fn()
      .mockImplementation(({ children }: { children: React.ReactNode }) => <div>{children}</div>),
  };
});

describe('[INTEGRATION] - Tenant agent add configuration page', () => {
  it('Tenant agent add configuration page display datagrid', async () => {
    const agent = mockAgents[0]!;
    const { container } = await renderTest({
      initialRoute: `/services/dashboard/${TENANTS_MOCKS[0]!.id}/agents/configure/${agent.id}`,
    });

    await waitFor(
      () => {
        expect(container.querySelector(`ods-text[preset="heading-2"]`)).toHaveTextContent(
          agent.currentState.name,
        );
      },
      { timeout: 10_000 },
    );

    [labels.commonDashboard.name, labels.system.address_ip, LABELS.BACKUP_POLICY].forEach((label) =>
      expect(
        screen
          .getByRole('form', { name: labels.servicesAgent.service_informations })
          ?.textContent?.includes(label),
      ).toBe(true),
    );
  });
});
