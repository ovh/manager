import React, { PropsWithChildren } from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeepPartial } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TRegionData } from '@/adapters/catalog/left/shareCatalog.data';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { MacroRegionSelection } from '@/pages/create/components/localisation/macroRegion/MacroRegionSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/catalog/useShareCatalog');

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'test-project-id' }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({
    trackClick: vi.fn(),
  }),
  ButtonType: {
    tile: 'tile',
  },
  PageLocation: {
    funnel: 'funnel',
  },
}));

vi.mock('@/components/new-lib/localizationCard/LocalizationCard.component', () => ({
  LocalizationCard: ({
    city,
    onSelect,
    disabled,
  }: {
    city: string;
    onSelect: () => void;
    disabled: boolean;
  }) => (
    <div role="button" aria-disabled={disabled} onClick={onSelect}>
      {city}
    </div>
  ),
}));

vi.mock('@/pages/create/components/localisation/macroRegion/ContinentSelection.component', () => ({
  ContinentSelection: () => (
    <div>
      <div role="combobox" aria-label="continent-select" />
    </div>
  ),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  RadioGroup: ({
    children,
    value,
  }: PropsWithChildren<{
    value: string;
  }>) => (
    <div role="radiogroup" data-value={value}>
      {children}
    </div>
  ),
}));

const mockUseShareCatalog = vi.mocked(useShareCatalog);

describe('MacroRegionSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle region card selection', async () => {
    const localizations: TRegionData[] = [
      {
        cityKey: 'manager_components_region_GRA',
        datacenterDetails: 'GRA1',
        macroRegion: 'GRA',
        microRegion: 'GRA1',
        deploymentMode: 'region',
        countryCode: 'fr',
        microRegions: [],
        available: true,
      },
      {
        cityKey: 'manager_components_region_SBG',
        datacenterDetails: 'SBG1',
        macroRegion: 'SBG',
        microRegion: 'SBG1',
        deploymentMode: 'region',
        countryCode: 'fr',
        microRegions: [],
        available: true,
      },
    ];

    mockUseShareCatalog.mockReturnValue({
      data: localizations,
    } as unknown as QueryObserverSuccessResult<TRegionData>);

    let formValues: DeepPartial<CreateShareFormValues> | undefined;

    renderWithMockedForm(<MacroRegionSelection />, {
      defaultValues: { continent: 'all', macroRegion: 'GRA' },
      onFormChange: (values) => {
        formValues = values;
      },
    });

    expect(screen.getByRole('combobox')).toBeVisible();
    expect(screen.getByRole('radiogroup')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'regions:manager_components_region_GRA' }),
    ).toBeVisible();

    const sbgButton = screen.getByRole('button', { name: 'regions:manager_components_region_SBG' });

    await act(async () => {
      await userEvent.click(sbgButton);
    });

    await waitFor(() => {
      expect(formValues?.macroRegion).toEqual('SBG');
      expect(formValues?.shareData?.microRegion).toEqual('SBG1');
    });
  });
});
