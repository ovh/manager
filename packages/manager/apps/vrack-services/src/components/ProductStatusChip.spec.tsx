import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ProductStatusChip,
  ProductStatusChipProps,
} from './ProductStatusChip.component';
import { ProductStatus } from '@/data';

const renderComponent = ({ productStatus }: ProductStatusChipProps) => {
  return render(<ProductStatusChip productStatus={productStatus} />);
};

describe('ProductStatusChip Component', () => {
  it.each([
    [ProductStatus.ACTIVE, ODS_THEME_COLOR_INTENT.success],
    [ProductStatus.SUSPENDED, ODS_THEME_COLOR_INTENT.default],
    [ProductStatus.DRAFT, ODS_THEME_COLOR_INTENT.info],
  ])('should display the %s status in the %s color', (status, color) => {
    const { getByText } = renderComponent({ productStatus: status });
    expect(getByText(status)).toHaveAttribute('color', color);
  });

  it('should display a loader if status not available', async () => {
    const { getByTestId } = renderComponent({ productStatus: undefined });
    expect(getByTestId('status-chip-spinner')).toBeDefined();
  });
});
