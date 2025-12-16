import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { VrackServicesProductStatus } from '@ovh-ux/manager-network-common';
import { ProductStatusChip } from '@/components/ProductStatusChip.component';
import { getSpanByOdsData } from '@/test-utils';

describe('ProductStatusChip Component', () => {
  it('should display a badge when the status is available', async () => {
    const { container } = render(
      <ProductStatusChip productStatus={VrackServicesProductStatus.ACTIVE} />,
    );

    const badgeElement = await getSpanByOdsData({
      container,
      odsData: 'badge',
    });
    expect(badgeElement).toBeInTheDocument();
  });

  it('should display a loader if status not available', async () => {
    const { getByTestId } = render(
      <ProductStatusChip productStatus={undefined} />,
    );
    expect(getByTestId('status-chip-spinner')).toBeInTheDocument();
  });
});
