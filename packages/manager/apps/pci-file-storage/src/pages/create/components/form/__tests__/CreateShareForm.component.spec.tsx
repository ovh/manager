import React, { PropsWithChildren } from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TMicroRegionData } from '@/adapters/catalog/left/shareCatalog.data';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { CreateShareForm } from '@/pages/create/components/form/CreateShareForm.component';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/catalog/useShareCatalog');

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'test-project-id' }),
}));

vi.mock('@/pages/create/components/name/NameInput.component', () => ({
  NameInput: () => <div data-testid="name-input">Name Input</div>,
}));

vi.mock('@/pages/create/components/localisation/deploymentMode/DeploymentModeSection.component', () => ({
  DeploymentModeSection: () => (
    <div data-testid="deployment-mode-section">Deployment Mode Section</div>
  ),
}));

vi.mock('@/pages/create/components/localisation/macroRegion/MacroRegionSelection.component', () => ({
  MacroRegionSelection: () => (
    <div data-testid="macro-region-selection">Macro Region Selection</div>
  ),
}));

vi.mock('@/pages/create/components/localisation/microRegion/MicroRegionSelection.component', () => ({
  MicroRegionSelection: () => (
    <div data-testid="micro-region-selection">Micro Region Selection</div>
  ),
}));

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
    } as unknown as QueryObserverSuccessResult<TMicroRegionData[]>);

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
  ])('$description', ({ microRegionOptions, shouldRender }) => {
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
    },
  );
});

