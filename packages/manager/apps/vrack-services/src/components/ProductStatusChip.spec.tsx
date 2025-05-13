import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ProductStatusChip } from '@/components/ProductStatusChip.component';

describe('ProductStatusChip Component', () => {
  it('should display a loader if status not available', async () => {
    const { getByTestId } = render(
      <ProductStatusChip productStatus={undefined} />,
    );
    expect(getByTestId('status-chip-spinner')).toBeDefined();
  });
});
