import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { VrackServicesProductStatus } from '@ovh-ux/manager-network-common';
import {
  ProductStatusChip,
  ProductStatusChipProps,
} from './ProductStatusChip.component';

const renderComponent = ({ productStatus }: ProductStatusChipProps) => {
  return render(<ProductStatusChip productStatus={productStatus} />);
};

describe('ProductStatusChip Component', () => {
  it.each([
    [VrackServicesProductStatus.ACTIVE, ODS_BADGE_COLOR.success],
    [VrackServicesProductStatus.SUSPENDED, ODS_BADGE_COLOR.neutral],
    [VrackServicesProductStatus.DRAFT, ODS_BADGE_COLOR.information],
  ])('should display the %s status in the %s color', (status, color) => {
    const { getByText } = renderComponent({ productStatus: status });
    expect(getByText(status)).toHaveAttribute('color', color);
  });

  it('should display a loader if status not available', async () => {
    const { getByTestId } = renderComponent({ productStatus: undefined });
    expect(getByTestId('status-chip-spinner')).toBeDefined();
  });
});
