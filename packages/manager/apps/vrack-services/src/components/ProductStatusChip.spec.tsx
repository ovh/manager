import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
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
    [VrackServicesProductStatus.ACTIVE, ODS_THEME_COLOR_INTENT.success],
    [VrackServicesProductStatus.SUSPENDED, ODS_THEME_COLOR_INTENT.default],
    [VrackServicesProductStatus.DRAFT, ODS_THEME_COLOR_INTENT.info],
  ])('should display the %s status in the %s color', (status, color) => {
    const { getByText } = renderComponent({ productStatus: status });
    expect(getByText(status)).toHaveAttribute('color', color);
  });

  it('should display a loader if status not available', async () => {
    const { getByTestId } = renderComponent({ productStatus: undefined });
    expect(getByTestId('status-chip-spinner')).toBeDefined();
  });
});
