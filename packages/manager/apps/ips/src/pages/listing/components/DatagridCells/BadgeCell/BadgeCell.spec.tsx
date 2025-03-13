import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import { BadgeCell, BadgeCellParams } from './BadgeCell';
import { getTooltipByText } from '@/test-utils';

const queryClient = new QueryClient();

/** RENDER */
const renderComponent = (params: BadgeCellParams) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <BadgeCell {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
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
