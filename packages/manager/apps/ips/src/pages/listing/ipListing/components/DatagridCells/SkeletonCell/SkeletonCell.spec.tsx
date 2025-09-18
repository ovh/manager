import React, { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { SkeletonCell, SkeletonCellParams } from './SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

/** MOCKS */
const addExpiredIp = vi.fn();

/** RENDER */
const renderComponent = (params: SkeletonCellParams, child?: ReactNode) => {
  return render(
    <ListingContext.Provider
      value={{
        ...listingContextDefaultParams,
        addExpiredIp,
      }}
    >
      <SkeletonCell {...params}>{child}</SkeletonCell>
    </ListingContext.Provider>,
  );
};

describe('SkeletonCell Component', async () => {
  it('Should display skeleton if loading is true', () => {
    const { container } = renderComponent({ isLoading: true });
    expect(container.querySelectorAll('ods-skeleton')).toBeDefined();
  });

  it('Should put ip in expiredIp list of listing context', () => {
    renderComponent({
      isLoading: false,
      ip: 'test',
      error: { response: { status: 460 } } as ApiError,
    });
    expect(addExpiredIp).toHaveBeenCalledWith('test');
  });

  it('Should display child component if loading done and is enabled', async () => {
    const { getByText } = renderComponent(
      { isLoading: false, ip: 'test' },
      'test',
    );
    await waitFor(() => {
      expect(getByText('test')).toBeDefined();
    });
  });
});
