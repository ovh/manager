import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeepPartial } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { AvailabilityZoneSelection } from '@/pages/create/components/localisation/availabilityZone/AvailabilityZoneSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { TAvailabilityZoneData } from '@/pages/create/view-model/shareCatalog.view-model';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/catalog/useShareCatalog');

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'test-project-id' }),
}));

const mockUseShareCatalog = vi.mocked(useShareCatalog);

describe('AvailabilityZoneSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render availability zone selection with company choice selected by default', () => {
    const availabilityZones: TAvailabilityZoneData[] = [
      { label: 'GRA1-A', value: 'GRA1-A' },
      { label: 'GRA1-B', value: 'GRA1-B' },
    ];

    mockUseShareCatalog.mockReturnValue({
      data: availabilityZones,
    } as unknown as QueryObserverSuccessResult<TAvailabilityZoneData[]>);

    renderWithMockedForm(<AvailabilityZoneSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA1' } },
    });

    expect(screen.getByText('create:localisation.availabilityZone.title')).toBeVisible();
    expect(screen.getByText('create:localisation.availabilityZone.informations')).toBeVisible();
    expect(
      screen.getByRole('radio', { name: 'create:localisation.availabilityZone.choice.company' }),
    ).toBeVisible();
    expect(
      screen.getByRole('radio', { name: 'create:localisation.availabilityZone.choice.company' }),
    ).toBeChecked();
    expect(
      screen.getByRole('radio', { name: 'create:localisation.availabilityZone.choice.user' }),
    ).toBeVisible();
  });

  it('should update availability zone when user selects a zone', async () => {
    const availabilityZones: TAvailabilityZoneData[] = [
      { label: 'GRA1-A', value: 'GRA1-A' },
      { label: 'GRA1-B', value: 'GRA1-B' },
    ];

    mockUseShareCatalog.mockReturnValue({
      data: availabilityZones,
    } as unknown as QueryObserverSuccessResult<TAvailabilityZoneData[]>);

    let formValues: DeepPartial<CreateShareFormValues> = {};

    renderWithMockedForm(<AvailabilityZoneSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA1' } },
      onFormChange: (values) => {
        formValues = values;
      },
    });

    const userChoiceRadio = screen.getByRole('radio', {
      name: 'create:localisation.availabilityZone.choice.user',
    });
    await act(async () => {
      await userEvent.click(userChoiceRadio);
    });

    await waitFor(() => {
      expect(screen.getByText('GRA1-A')).toBeVisible();
      expect(screen.getByText('GRA1-B')).toBeVisible();
    });

    await act(async () => {
      await userEvent.click(screen.getByText('GRA1-B'));
    });

    await waitFor(() => {
      expect(formValues.availabilityZone).toBe('GRA1-B');
    });
  });
});
