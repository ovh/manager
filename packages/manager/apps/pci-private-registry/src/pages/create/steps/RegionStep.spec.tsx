import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import {
  ProjectLocalisation,
  TLocalisation,
  useParam,
  useProjectLocalisation,
} from '@ovh-ux/manager-pci-common';
import RegionStep from './RegionStep';
import { wrapper } from '@/wrapperRenders';
import { useStore } from '@/pages/create/store';
import { useGetCapabilities } from '@/api/hooks/useCapabilities';
import { use3AZFeatureAvailability } from '@/hooks/features/use3AZFeatureAvailability';
import { DeploymentMode } from '@/types';
import { TCapability } from '@/api/data/capability';

vi.mock('@/pages/create/store');
vi.mock('@/api/hooks/useCapabilities');
vi.mock('@ovh-ux/manager-pci-common');
vi.mock('@/hooks/features/use3AZFeatureAvailability');
vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...actual,
    StepComponent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="step-component">{children}</div>
    ),
    Subtitle: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="subtitle">{children}</div>
    ),
    TilesInputComponent: ({
      items,
      value,
      onInput,
    }: {
      items: TLocalisation[];
      value: TLocalisation;
      onInput: (value: TLocalisation) => void;
    }) => (
      <div data-testid="tiles-input-component">
        {items.map((item) => (
          <div
            key={item.name}
            data-testid="tile"
            onClick={() => onInput(item)}
            className={value?.name === item.name ? 'selected' : ''}
          >
            {item.name}
          </div>
        ))}
      </div>
    ),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...actual,
    DeploymentTilesInput: ({
      value,
      onChange,
      deployments,
      isLocked,
    }: {
      value: TLocalisation;
      onChange: (value: TLocalisation) => void;
      deployments: TLocalisation[];
      isLocked: boolean;
    }) => (
      <div>
        Selected : {value?.name}
        {isLocked && <div data-testid="locked">Locked</div>}
        {deployments.map((e) => (
          <div
            key={e.name}
            data-testid={`deployment-tiles-input-${e.name}`}
            onClick={() => onChange({ name: e.name } as TLocalisation)}
          >
            {e?.name || 'none'}
          </div>
        ))}
      </div>
    ),
    useProjectLocalisation: vi.fn(),
    useParam: vi.fn(),
  };
});

describe('RegionStep Component', () => {
  const mockStore = {
    state: { region: null },
    set: { region: vi.fn(), plan: vi.fn() },
    stepsState: {
      REGION: { isOpen: true, isLocked: false, isChecked: false },
      NAME: { isOpen: false, isLocked: false, isChecked: false },
      PLAN: { isOpen: false, isLocked: false, isChecked: false },
    },
    stepsHandle: {
      check: vi.fn(),
      uncheck: vi.fn(),
      lock: vi.fn(),
      unlock: vi.fn(),
      open: vi.fn(),
      close: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useStore).mockReturnValue(mockStore);
    vi.mocked(useGetCapabilities).mockReturnValue({
      data: [
        { regionName: 'GRA', plans: [{ name: 'MEDIUM' }] },
        { regionName: 'REG1', plans: [{ name: 'MEDIUM' }] },
      ],
      isPending: false,
    } as UseQueryResult<TCapability[], Error>);
    vi.mocked(useProjectLocalisation).mockReturnValue({
      data: {
        regions: [
          { name: 'REG1', type: DeploymentMode.MULTI_ZONES },
          { name: 'GRA', type: 'region' },
        ],
      },
      isPending: false,
    } as UseQueryResult<ProjectLocalisation, Error>);
    vi.mocked(use3AZFeatureAvailability).mockReturnValue({
      is3AZEnabled: true,
      isPending: false,
    });
    vi.mocked(useParam).mockReturnValue({ projectId: 'project-1' });
  });

  it('renders without crashing', () => {
    render(<RegionStep />, { wrapper });
    expect(
      screen.getByText('create:private_registry_create_location'),
    ).toBeDefined();
  });

  it('shows spinner when loading localisations', () => {
    vi.mocked(useProjectLocalisation).mockReturnValue(({
      data: { regions: [] },
      isPending: true,
    } as unknown) as UseQueryResult<ProjectLocalisation>);
    render(<RegionStep />, { wrapper });
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('selects the 3AZ tile by default', () => {
    render(<RegionStep />, { wrapper });

    const tile = screen.getByTestId('deployment-tiles-input-region-3-az');
    expect(tile).toHaveTextContent('region-3-az');
  });

  it('changes tile when clicked', async () => {
    render(<RegionStep />, { wrapper });

    const tile = screen.getByTestId('deployment-tiles-input-region');
    fireEvent.click(tile);
    expect(tile).toHaveTextContent('region');
  });
});
