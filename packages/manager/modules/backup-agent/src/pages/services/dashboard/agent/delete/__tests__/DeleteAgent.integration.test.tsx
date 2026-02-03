import { screen, waitFor } from '@testing-library/react';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';

import { mockAgents } from '@/mocks/agents/agents';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';

describe('[INTEGRATION] - Delete Agent page', () => {
  it('display delete agent modal', async () => {
    const agent = mockAgents[0]!;
    const { container } = await renderTest({
      initialRoute: `/agents/delete/${agent.id}`,
    });

    await waitFor(
      () => {
        expect(container.querySelectorAll(`ods-text[preset="paragraph"]`)[1]).toHaveTextContent(
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
