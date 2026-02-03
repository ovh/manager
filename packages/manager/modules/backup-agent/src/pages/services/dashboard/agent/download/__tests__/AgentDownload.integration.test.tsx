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
    OdsModal: vi
      .fn()
      .mockImplementation(({ children }: { children: React.ReactNode }) => <div>{children}</div>),
  };
});

describe('[INTEGRATION] - Tenant agent download modal page', () => {
  it('Tenant agent download modal page display', async () => {
    const { container } = await renderTest({
      initialRoute: `/agents/download`,
    });

    await expect(container).toBeAccessible();

    await waitFor(
      () => {
        expect(container.querySelector(`ods-text[preset="heading-4"]`)).toHaveTextContent(
          labels.servicesAgent.download_agent,
        );
      },
      { timeout: 10_000 },
    );

    [
      labels.servicesAgent.select_os,
      labels.servicesAgent.download_agent_with_command_line,
      labels.servicesAgent.download_agent_with_executable,
    ].forEach((label) => expect(screen.getByText(label)).toBeVisible());
  });
});
