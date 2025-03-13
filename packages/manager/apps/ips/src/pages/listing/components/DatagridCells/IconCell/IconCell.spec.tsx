import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import { IconCell, IconCellParams } from './IconCell';
import { getTooltipByText } from '@/test-utils';

const queryClient = new QueryClient();

/** RENDER */
const renderComponent = (params: IconCellParams) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <IconCell {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
};

describe('IconCell Component', async () => {
  it('Should display Tooltip', async () => {
    const { container } = renderComponent({
      icon: ODS_ICON_NAME.bell,
      text: 'test',
      tooltip: 'tooltip',
      trigger: 'tooltip-trigger-id',
    });
    await getTooltipByText({ container, text: 'tooltip' });
  });
});
