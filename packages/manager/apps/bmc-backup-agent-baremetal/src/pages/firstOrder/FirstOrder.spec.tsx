import { screen, waitFor } from '@testing-library/react';

import { ONBOARDING_CONFIG } from '@/App.constants';
import { renderTest } from '@/utils/Test.utils';
import { labels } from '@/utils/tests/i18ntest.utils';

describe('FirstOrderPage', () => {
  it('renders FirstOrderPage', async () => {
    const { container } = await renderTest({ initialRoute: '/first-order' });

    await waitFor(() => {
      expect(screen.getByText(ONBOARDING_CONFIG.productName)).toBeVisible();
      expect(container.querySelector(`ods-button[label="${labels.actions.start}"]`)).toBeVisible();
    });
  });
});
