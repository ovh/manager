import { describe, it } from 'vitest';

import { labels } from '@/__tests__/test-i18n';
import { getElementByText, renderTestComponent } from '@/__tests__/uiTestHelpers';

import OverviewTab from '../OverviewTab.page';

describe('OverviewTab', () => {
  it('should display the general informations of the vs', async () => {
    const { container } = await renderTestComponent({
      component: <OverviewTab />,
      nbVs: 1,
    });

    await getElementByText({
      value: labels.dashboard.tileTitle,
    });
    expect(container).toMatchSnapshot();
  });
});
