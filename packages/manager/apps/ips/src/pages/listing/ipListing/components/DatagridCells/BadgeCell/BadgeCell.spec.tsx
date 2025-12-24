import React from 'react';

import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { getTooltipByText } from '@/test-utils';
import '@/test-utils/setupUnitTests';

import { BadgeCell, BadgeCellParams } from './BadgeCell';

const renderComponent = (params: BadgeCellParams) => {
  return render(<BadgeCell {...params} />);
};

describe('BadgeCell Component', () => {
  it('Should display Tooltip', async () => {
    const { container } = renderComponent({
      badgeColor: ODS_BADGE_COLOR.information,
      text: 'test',
      tooltip: 'tooltip',
      trigger: 'tooltip-trigger-id',
    });
    const tooltip = await getTooltipByText({ container, text: 'tooltip' });
    expect(tooltip).toBeInTheDocument();
  });
});
