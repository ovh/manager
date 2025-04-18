import React from 'react';
import { describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import ActionButtonStatistics from './ActionButtonStatistics.component';
import { websitesMocks } from '@/data/_mock_';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

describe('ActionButtonStatistics component', () => {
  it('should render', () => {
    const { container } = render(
      <ActionButtonStatistics webSiteItem={websitesMocks[0]} />,
    );
    expect(container).toBeInTheDocument();
    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(1);
    expect(menuItems[0]).toHaveAttribute(
      'label',
      commonTranslation.web_hosting_dashboard_action_statistics,
    );
  });
});
