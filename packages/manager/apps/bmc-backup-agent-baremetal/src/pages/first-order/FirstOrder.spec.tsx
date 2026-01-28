import { screen, waitFor } from '@testing-library/react';

import { renderTest } from '@/utils/Test.utils';
import { labels } from '@/utils/tests/i18ntest.utils';

describe('FirstOrderPage', () => {
  it('renders FirstOrderPage', async () => {
    const { container } = await renderTest({ initialRoute: '/first-order' });

    await waitFor(
      () => {
        expect(screen.getByText(labels.onboarding.title_fallback)).toBeVisible();
        expect(
          container.querySelector(`ods-button[label="${labels.actions.start}"]`),
        ).toBeVisible();
      },
      { timeout: 10000 },
    );
  });
});
