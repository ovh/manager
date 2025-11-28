import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { BadgeCell, BadgeCellParams } from './BadgeCell';
import { getTooltipByText } from '@/test-utils';

const renderComponent = (params: BadgeCellParams) => {
  return render(<BadgeCell {...params} />);
};

describe('BadgeCell Component', async () => {
  it('Should display Tooltip', async () => {
    const { container } = renderComponent({
      badgeColor: ODS_BADGE_COLOR.information,
      text: 'test',
      tooltip: 'tooltip',
      trigger: 'tooltip-trigger-id',
    });
    await getTooltipByText({ container, text: 'tooltip' });
  });
});
