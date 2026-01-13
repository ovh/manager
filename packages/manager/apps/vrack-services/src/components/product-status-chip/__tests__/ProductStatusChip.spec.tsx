import React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VrackServicesProductStatus } from '@ovh-ux/manager-network-common';

import { getSpanByOdsData } from '@/__tests__/uiTestHelpers';
import { ProductStatusChip } from '@/components/product-status-chip/ProductStatusChip.component';

describe('ProductStatusChip Component', () => {
  it('should display a badge when the status is available', async () => {
    const { container } = render(
      <ProductStatusChip productStatus={VrackServicesProductStatus.ACTIVE} />,
    );

    const badgeElement = await getSpanByOdsData({
      container,
      odsData: 'badge',
    });
    expect(badgeElement).toBeDefined();
    expect(badgeElement).toBeInTheDocument();
  });
});
