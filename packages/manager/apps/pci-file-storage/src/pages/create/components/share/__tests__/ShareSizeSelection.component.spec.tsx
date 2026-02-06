import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeepPartial } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TShareSpecData } from '@/adapters/catalog/left/shareCatalog.data';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { ShareSizeSelection } from '@/pages/create/components/share/ShareSizeSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { provisionedPerformancePresenter } from '@/pages/create/view-model/shareCatalog.view-model';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/catalog/useShareCatalog');
vi.mock('@/pages/create/view-model/shareCatalog.view-model', async (importOriginal) => {
  const original: typeof import('@/pages/create/view-model/shareCatalog.view-model') =
    await importOriginal();

  return {
    ...original,
    provisionedPerformancePresenter: vi.fn(),
  };
});

const mockUseShareCatalog = vi.mocked(useShareCatalog);
const mockProvisionedPerformancePresenter = vi.mocked(provisionedPerformancePresenter);

describe('ShareSizeSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const generalShareSpec = {
    iopsMax: 16_000,
    iopsUnit: 'IOPS',
    iopsMaxUnit: 'IOPS',
    iopsGuaranteed: false,
    bandwidthMin: 25,
    bandwidthMax: 128,
    bandwidthMaxUnit: 'MB/s',
    bandwidthGuaranteed: false,
    microRegionIds: [],
    price: 0,
    priceInterval: '',
    calculateProvisionedPerformance: () => null,
  };

  it('should render title, label, and current size', () => {
    const shareOptions: TShareSpecData[] = [
      {
        ...generalShareSpec,
        name: 'publiccloud-share-standard1',
        capacityMin: 150,
        capacityMax: 10240,
        iopsLevel: 30,
        bandwidthLevel: 0.25,
        bandwidthUnit: 'MB/s/GB',
      },
    ];

    mockUseShareCatalog.mockReturnValue({
      data: shareOptions,
    } as unknown as QueryObserverSuccessResult<TShareSpecData[]>);

    renderWithMockedForm(<ShareSizeSelection />, {
      defaultValues: {
        shareData: {
          microRegion: 'GRA1',
          specName: 'publiccloud-share-standard1',
          size: 0,
        },
      },
    });

    expect(screen.getByText('create:shareSize.title')).toBeVisible();
    expect(screen.getByText('create:shareSize.label')).toBeVisible();
  });

  it('should update form value when input changes', async () => {
    const shareOptions: TShareSpecData[] = [
      {
        ...generalShareSpec,
        name: 'publiccloud-share-standard1',
        capacityMin: 150,
        capacityMax: 10240,
        iopsLevel: 30,
        bandwidthLevel: 0.25,
        bandwidthUnit: 'MB/s/GB',
      },
    ];

    mockUseShareCatalog.mockReturnValue({
      data: shareOptions,
    } as unknown as QueryObserverSuccessResult<TShareSpecData[]>);

    let formValues: DeepPartial<CreateShareFormValues>;

    renderWithMockedForm(<ShareSizeSelection />, {
      defaultValues: {
        shareData: {
          microRegion: 'GRA1',
          specName: 'publiccloud-share-standard1',
          size: 0,
        },
      },
      onFormChange: (values) => {
        formValues = values;
      },
    });

    const input = screen.getByRole('spinbutton');

    await act(async () => {
      await userEvent.type(input, '1');
    });

    await waitFor(() => {
      expect(formValues?.shareData?.size).toEqual(1501);
    });
  });

  it('should update iops and throughput description on change', async () => {
    const shareOptions: TShareSpecData[] = [
      {
        ...generalShareSpec,
        name: 'publiccloud-share-standard1',
        capacityMin: 150,
        capacityMax: 10240,
        iopsLevel: 30,
        bandwidthLevel: 0.25,
        bandwidthUnit: 'MB/s/GB',
        calculateProvisionedPerformance: (size: number) => {
          if (size === 150) return { iops: 3600, throughput: 37.5 };
          if (size === 500) return { iops: 12000, throughput: 125 };
          return { iops: 12000, throughput: 125 };
        },
      },
    ];

    mockUseShareCatalog.mockReturnValue({
      data: shareOptions,
    } as unknown as QueryObserverSuccessResult<TShareSpecData[]>);

    mockProvisionedPerformancePresenter.mockImplementation(
      ({ iops, throughput }: { iops: number; throughput: number }) => ({
        iops: iops.toString(),
        throughput: throughput.toString(),
      }),
    );

    renderWithMockedForm(<ShareSizeSelection />, {
      defaultValues: {
        shareData: {
          microRegion: 'GRA1',
          specName: 'publiccloud-share-standard1',
          size: 150,
        },
      },
    });

    const provisionedPerformance = screen.getByText('create:shareSize.provisionedPerformance', {
      exact: false,
    });

    expect(provisionedPerformance).toHaveTextContent('iops:3600');
    expect(provisionedPerformance).toHaveTextContent('throughput:37.5');

    const input = screen.getByRole('spinbutton');

    await act(async () => {
      await userEvent.clear(input);
      await userEvent.type(input, '500');
    });

    await waitFor(() => {
      const provisionedPerformance = screen.getByText('create:shareSize.provisionedPerformance', {
        exact: false,
      });

      expect(provisionedPerformance).toHaveTextContent('iops:12000');
      expect(provisionedPerformance).toHaveTextContent('throughput:125');
    });
  });

  const shareOptions: TShareSpecData[] = [
    {
      ...generalShareSpec,
      name: 'publiccloud-share-standard1',
      capacityMin: 150,
      capacityMax: 2048,
      iopsLevel: 30,
      bandwidthLevel: 0.25,
      bandwidthUnit: 'MB/s/GB',
    },
  ];

  it.each([
    { case: 'too small', userInput: '100', expectedErrorKey: 'create:shareSize.error.min_value' },
    { case: 'too big', userInput: '5000', expectedErrorKey: 'create:shareSize.error.max_value' },
    {
      case: 'empty',
      userInput: undefined,
      expectedErrorKey: 'create:shareSize.error.invalid_type',
    },
  ])('should show error when value is $case', async ({ userInput, expectedErrorKey }) => {
    mockUseShareCatalog.mockReturnValue({
      data: shareOptions,
    } as unknown as QueryObserverSuccessResult<TShareSpecData[]>);

    renderWithMockedForm(<ShareSizeSelection />, {
      defaultValues: {
        shareData: {
          microRegion: 'GRA1',
          specName: 'publiccloud-share-standard1',
          size: 500,
        },
      },
    });

    const input = screen.getByRole('spinbutton');

    await act(async () => {
      await userEvent.clear(input);
      if (userInput) {
        await userEvent.type(input, userInput);
      }
    });

    await waitFor(() => {
      expect(screen.getByText(expectedErrorKey)).toBeVisible();
    });
  });
});
