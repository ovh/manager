import React, { PropsWithChildren } from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TAvailabilityZoneData, TMicroRegionData } from '@/adapters/catalog/left/shareCatalog.data';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { CreateShareForm } from '@/pages/create/components/form/CreateShareForm.component';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/catalog/useShareCatalog');

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual<typeof import('react-hook-form')>('react-hook-form');
  return {
    ...actual,
    useWatch: vi.fn().mockReturnValue(['GRA', 'GRA1']),
  };
});

const mockUseCreateShareForm = vi.fn(
  () =>
    ({
      control: {},
    }) as ReturnType<typeof import('@/pages/create/hooks/useCreateShareForm').useCreateShareForm>,
);

vi.mock('@/pages/create/hooks/useCreateShareForm', () => ({
  useCreateShareForm: () => mockUseCreateShareForm(),
}));

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'test-project-id' }),
}));

vi.mock('@/pages/create/components/name/NameInput.component', () => ({
  NameInput: () => <div data-testid="name-input">Name Input</div>,
}));

vi.mock(
  '@/pages/create/components/localisation/deploymentMode/DeploymentModeSection.component',
  () => ({
    DeploymentModeSection: () => (
      <div data-testid="deployment-mode-section">Deployment Mode Section</div>
    ),
  }),
);

vi.mock(
  '@/pages/create/components/localisation/macroRegion/MacroRegionSelection.component',
  () => ({
    MacroRegionSelection: () => (
      <div data-testid="macro-region-selection">Macro Region Selection</div>
    ),
  }),
);

vi.mock(
  '@/pages/create/components/localisation/microRegion/MicroRegionSelection.component',
  () => ({
    MicroRegionSelection: () => (
      <div data-testid="micro-region-selection">Micro Region Selection</div>
    ),
  }),
);

vi.mock(
  '@/pages/create/components/localisation/availabilityZone/AvailabilityZoneSelection.component',
  () => ({
    AvailabilityZoneSelection: () => (
      <div data-testid="availability-zone-selection">Availability Zone Selection</div>
    ),
  }),
);

vi.mock('@ovhcloud/ods-react', () => ({
  Divider: ({ className }: { className: string }) => (
    <div data-testid="divider" className={className} />
  ),
  Text: ({ children, preset }: PropsWithChildren<{ preset: string }>) => (
    <div data-testid={`text-${preset}`}>{children}</div>
  ),
}));

const mockUseShareCatalog = vi.mocked(useShareCatalog);

describe('CreateShareForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form sections', () => {
    mockUseShareCatalog.mockReturnValue({
      data: [],
    } as unknown as QueryObserverSuccessResult<TMicroRegionData[] | TAvailabilityZoneData[]>);

    renderWithMockedForm(<CreateShareForm />);

    expect(screen.getByTestId('name-input')).toBeVisible();
    expect(screen.getByTestId('deployment-mode-section')).toBeVisible();
    expect(screen.getByTestId('macro-region-selection')).toBeVisible();
  });

  it.each([
    {
      description: 'should not render MicroRegionSelection when there are 0 micro regions',
      microRegionOptions: [],
      shouldRender: false,
    },
    {
      description: 'should not render MicroRegionSelection when there is 1 micro region',
      microRegionOptions: [{ label: 'GRA1', value: 'GRA1', disabled: false }],
      shouldRender: false,
    },
    {
      description: 'should not render MicroRegionSelection when microRegionOptions is undefined',
      microRegionOptions: undefined,
      shouldRender: false,
    },
    {
      description: 'should render MicroRegionSelection when there are more than 1 micro regions',
      microRegionOptions: [
        { label: 'GRA1', value: 'GRA1', disabled: false },
        { label: 'GRA2', value: 'GRA2', disabled: false },
      ],
      shouldRender: true,
    },
  ])('MicroRegionSelection: $description', ({ microRegionOptions, shouldRender }) => {
    mockUseShareCatalog.mockReturnValue({
      data: microRegionOptions,
    } as unknown as QueryObserverSuccessResult<TMicroRegionData[]>);

    renderWithMockedForm(<CreateShareForm />, {
      defaultValues: { macroRegion: 'GRA' },
    });

    if (shouldRender) {
      expect(screen.getByTestId('micro-region-selection')).toBeVisible();
    } else {
      expect(screen.queryByTestId('micro-region-selection')).not.toBeInTheDocument();
    }
  });

  it.each([
    {
      description:
        'should not render AvailabilityZoneSelection when there are 0 availability zones',
      microRegionOptions: [],
      availabilityZones: [],
      shouldRender: false,
    },
    {
      description:
        'should not render AvailabilityZoneSelection when availabilityZones is undefined',
      microRegionOptions: [],
      availabilityZones: undefined,
      shouldRender: false,
    },
    {
      description: 'should render AvailabilityZoneSelection when there are availability zones',
      microRegionOptions: [],
      availabilityZones: [
        { label: 'GRA1-A', value: 'GRA1-A' },
        { label: 'GRA1-B', value: 'GRA1-B' },
      ],
      shouldRender: true,
    },
  ])(
    'AvailabilityZoneSelection: $description',
    ({ microRegionOptions, availabilityZones, shouldRender }) => {
      mockUseShareCatalog
        .mockReturnValueOnce({
          data: microRegionOptions,
        } as unknown as QueryObserverSuccessResult<TMicroRegionData[]>)
        .mockReturnValueOnce({
          data: availabilityZones,
        } as unknown as QueryObserverSuccessResult<TAvailabilityZoneData[]>);

      renderWithMockedForm(<CreateShareForm />, {
        defaultValues: { macroRegion: 'GRA', shareData: { microRegion: 'GRA1' } },
      });

      if (shouldRender) {
        expect(screen.getByTestId('availability-zone-selection')).toBeVisible();
      } else {
        expect(screen.queryByTestId('availability-zone-selection')).not.toBeInTheDocument();
      }
    },
  );
});
