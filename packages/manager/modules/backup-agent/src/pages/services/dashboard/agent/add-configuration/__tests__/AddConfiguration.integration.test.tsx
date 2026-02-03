import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

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
    const { container } = await renderTest({
      initialRoute: `/agents/add`,
    });

    await waitFor(
      () => {
        expect(container.querySelector(`ods-text[preset="heading-2"]`)).toHaveTextContent(
          labels.servicesAgent.add_server,
        );
      },
      { timeout: 10_000 },
    );

    await waitFor(() => {
      [
        labels.servicesAgent.select_server,
        labels.servicesAgent.select_os,
        labels.servicesAgent.download_agent,
      ]
        // eslint-disable-next-line max-nested-callbacks
        .forEach((label) => expect(screen.getByText(label)).toBeVisible());
    });
  });
});
