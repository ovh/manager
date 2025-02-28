import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  useFeatureAvailability,
  useProductMaintenance,
} from '@ovh-ux/manager-react-components';
import ListingPage from './Listing.page';
import { wrapper } from '@/wrapperRenders';
import { useStorages } from '@/api/hooks/useStorages';
import { TStoragesAapiResult } from '@/api/data/storages';

vi.mock('@/api/hooks/useStorages', () => {
  return {
    useStorages: vi.fn(),
  };
});

describe('ListingPage', () => {
  it('sould display spinner', () => {
    vi.mocked(useStorages).mockReturnValue({
      isPending: true,
      allStorages: [],
    } as never);
    vi.mocked(useFeatureAvailability).mockReturnValue({
      isPending: false,
    } as never);
    vi.fn(useProductMaintenance).mockReturnValue({
      hasMaintenance: false,
    } as never);
    const { asFragment } = render(<ListingPage />, { wrapper });
    expect(asFragment()).toMatchSnapshot();
  });

  it('sould display datagrid', () => {
    const storages = {
      resources: [
        {
          id: 'id',
          name: 'name',
        },
      ],
    } as TStoragesAapiResult;
    vi.mocked(useStorages).mockReturnValue({
      isPending: false,
      isLoading: false,
      allStorages: storages,
    } as never);
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: [{ feature: false }],
      isPending: false,
    } as never);
    vi.fn(useProductMaintenance).mockReturnValue({
      hasMaintenance: false,
    } as never);
    const { asFragment } = render(<ListingPage />, { wrapper });
    expect(asFragment()).toMatchSnapshot();
  });
});
