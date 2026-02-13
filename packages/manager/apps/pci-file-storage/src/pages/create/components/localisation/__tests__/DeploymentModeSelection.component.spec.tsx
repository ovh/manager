import React, { PropsWithChildren } from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { TDeploymentMode } from '@/domain/entities/catalog.entity';
import { DeploymentModeSelection } from '@/pages/create/components/localisation/deploymentMode/DeploymentModeSelection.component';
import { TDeploymentModeDataForCard } from '@/pages/create/view-model/shareCatalog.view-model';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/catalog/useShareCatalog');

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

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'test-project-id' }),
}));

vi.mock('@/components/new-lib/pciCard/PciCard.component', () => {
  const mock = {
    PciCard: ({
      children,
      onClick,
      selected,
      selectable,
    }: PropsWithChildren<{ onClick: () => void; selected: boolean; selectable: boolean }>) => (
      <div
        data-testid="pci-card"
        data-selected={selected}
        data-selectable={selectable}
        onClick={onClick}
      >
        {children}
      </div>
    ),
    PciCardHeader: ({ children }: PropsWithChildren) => (
      <div data-testid="pci-card-header">{children}</div>
    ),
    PciCardContent: ({ children }: PropsWithChildren) => (
      <div data-testid="pci-card-content">{children}</div>
    ),
    PciCardFooter: ({ children }: PropsWithChildren) => (
      <div data-testid="pci-card-footer">{children}</div>
    ),
  };

  // @ts-ignore
  mock.PciCard.Header = mock.PciCardHeader;
  // @ts-ignore
  mock.PciCard.Content = mock.PciCardContent;
  // @ts-ignore
  mock.PciCard.Footer = mock.PciCardFooter;
  return mock;
});

const mockUseShareCatalog = vi.mocked(useShareCatalog);

const mockDeploymentModes: TDeploymentModeDataForCard[] = [
  {
    mode: 'region-3-az',
    labelKey: 'localisation.deploymentMode.modes.region-3-az.label',
    descriptionKey: 'localisation.deploymentMode.modes.region-3-az.description',
    Image: () => <div data-testid="region-3-az-image">Region 3AZ Image</div>,
  },
  {
    mode: 'region',
    labelKey: 'localisation.deploymentMode.modes.region.label',
    descriptionKey: 'localisation.deploymentMode.modes.region.description',
    Image: () => <div data-testid="region-image">Region Image</div>,
  },
  {
    mode: 'localzone',
    labelKey: 'localisation.deploymentMode.modes.localzone.label',
    descriptionKey: 'localisation.deploymentMode.modes.localzone.description',
    Image: () => <div data-testid="localzone-image">Localzone Image</div>,
  },
];

describe('DeploymentModeSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render deployment modes when data is available', () => {
    mockUseShareCatalog.mockReturnValue({
      data: mockDeploymentModes,
    } as unknown as QueryObserverSuccessResult<TDeploymentModeDataForCard>);

    renderWithMockedForm(<DeploymentModeSelection />);

    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.getByTestId('region-image')).toBeVisible();
    expect(screen.getByTestId('localzone-image')).toBeVisible();
    expect(screen.getByTestId('region-3-az-image')).toBeVisible();
    expect(screen.getByText('create:localisation.deploymentMode.modes.region.label')).toBeVisible();
    expect(
      screen.getByText('create:localisation.deploymentMode.modes.region.description'),
    ).toBeVisible();
    expect(
      screen.getByText('create:localisation.deploymentMode.modes.region-3-az.label'),
    ).toBeVisible();
    expect(
      screen.getByText('create:localisation.deploymentMode.modes.region-3-az.description'),
    ).toBeVisible();
    expect(
      screen.getByText('create:localisation.deploymentMode.modes.localzone.label'),
    ).toBeVisible();
    expect(
      screen.getByText('create:localisation.deploymentMode.modes.localzone.description'),
    ).toBeVisible();
  });

  it('should render empty state when no deployment modes are available', () => {
    mockUseShareCatalog.mockReturnValue({
      data: [],
    } as unknown as QueryObserverSuccessResult<TDeploymentModeDataForCard>);

    renderWithMockedForm(<DeploymentModeSelection />);

    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('should handle deployment mode selection', async () => {
    mockUseShareCatalog.mockReturnValue({
      data: mockDeploymentModes,
    } as unknown as QueryObserverSuccessResult<TDeploymentModeDataForCard>);

    let formValues: { deploymentModes: TDeploymentMode[] } | undefined;

    renderWithMockedForm(<DeploymentModeSelection />, {
      defaultValues: { deploymentModes: ['region-3-az'] },
      onFormChange: (values) => {
        formValues = values as { deploymentModes: TDeploymentMode[] };
      },
    });

    await act(async () => {
      await userEvent.click(screen.getAllByTestId('pci-card')[1]!);
    });

    await waitFor(() => {
      expect(formValues?.deploymentModes).toEqual(['region-3-az', 'region']);
    });

    await act(async () => {
      await userEvent.click(screen.getAllByTestId('pci-card')[0]!);
    });

    await waitFor(() => {
      expect(formValues?.deploymentModes).toEqual(['region']);
    });
  });
});
