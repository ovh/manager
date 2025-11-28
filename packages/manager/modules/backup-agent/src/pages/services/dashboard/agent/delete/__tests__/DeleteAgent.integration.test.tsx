import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';

import { mockAgents } from '@/mocks/agents/agents';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';

describe('[INTEGRATION] - Delete Agent page', () => {
  it('display delete agent modal', async () => {
    const agent = mockAgents[0]!;
    const { container } = await renderTest({
      initialRoute: `/services/dashboard/${TENANTS_MOCKS[0]!.id}/agents/delete/${agent.id}`,
    });

    await waitFor(
      () => {
        expect(container.querySelector(`ods-text[preset="paragraph"]`)).toHaveTextContent(
          agent.currentState.name,
        );
      },
      { timeout: 10_000 },
    );

    const modal = screen.getByTestId('modal');
    expect(modal).toBeVisible();
    expect(modal).toHaveAttribute('color', ODS_MODAL_COLOR.critical);

    const modalButtons = [
      { testId: 'primary-button', label: labels.actions.confirm },
      { testId: 'secondary-button', label: labels.actions.cancel },
    ];

    modalButtons.forEach(({ testId, label }) => {
      expect(screen.getByTestId(testId)).toHaveAttribute('label', label);
    });
  });
});
