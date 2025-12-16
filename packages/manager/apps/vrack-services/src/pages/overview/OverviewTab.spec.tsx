import { describe, it } from 'vitest';
import React from 'react';
import { labels, getElementByText, renderTestComponent } from '@/test-utils';
import OverviewTab from './OverviewTab.page';

describe('OverviewTab', () => {
  it('should display the general informations of the vs', async () => {
    await renderTestComponent({
      component: <OverviewTab />,
      nbVs: 1,
    });

    await getElementByText({
      value: labels.dashboard.tileTitle,
    });
  });
});
