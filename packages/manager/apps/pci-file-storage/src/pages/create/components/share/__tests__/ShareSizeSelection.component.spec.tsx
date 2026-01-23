import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeepPartial } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TShareSpecData } from '@/adapters/catalog/left/shareCatalog.data';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { ShareSizeSelection } from '@/pages/create/components/share/ShareSizeSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/catalog/useShareCatalog');

const mockUseShareCatalog = vi.mocked(useShareCatalog);

describe('ShareSizeSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title, label, and current size', () => {
    const shareOptions: TShareSpecData[] = [
      {
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

  it('should constrain input value to max when above maximum', async () => {
    const shareOptions: TShareSpecData[] = [
      {
        name: 'publiccloud-share-standard1',
        capacityMin: 150,
        capacityMax: 2048,
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
          size: 500,
        },
      },
    });

    const input = screen.getByRole('spinbutton');

    await act(async () => {
      await userEvent.clear(input);
      await userEvent.type(input, '5000');
    });

    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe('2048');
    });
  });
});
