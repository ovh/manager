import {
  useParam as useSafeParams,
  useProjectLocalisation,
  TLocalisation,
  ProjectLocalisation,
} from '@ovh-ux/manager-pci-common';
import { UseQueryResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Mode from './DeploymentMode';

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...actual,
    useParam: vi.fn(),
    useProjectLocalisation: vi.fn(),
    RegionChipByType: ({ type }: { type: string }) => (
      <div data-testid="region-chip">{type}</div>
    ),
  };
});

describe('Mode component', () => {
  it('renders RegionChipByType with correct type when region is found', () => {
    vi.mocked(useSafeParams).mockReturnValue({ projectId: 'abc' });
    vi.mocked(useProjectLocalisation).mockReturnValue({
      data: {
        regions: [
          { name: 'GRA11', type: 'region' },
          { name: 'EU-WEST', type: 'region-3-az' },
        ],
      },
    } as UseQueryResult<ProjectLocalisation, Error>);

    const { rerender } = render(<Mode projectId="test-id" region="GRA11" />);
    const chip = screen.getByTestId('region-chip');
    expect(chip).toHaveTextContent('region');
    rerender(<Mode projectId="test-id" region="EU-WEST" />);
    expect(chip).toHaveTextContent('region-3-az');
  });

  it('renders nothing when region is not found', () => {
    vi.mocked(useSafeParams).mockReturnValue({ projectId: 'abc' });
    vi.mocked(useProjectLocalisation).mockReturnValue({
      data: {
        regions: [{ name: 'SBG1', type: 'legacy' }] as TLocalisation[],
      },
    } as UseQueryResult<ProjectLocalisation, Error>);

    const { container } = render(<Mode projectId="test-id" region="XYZ" />);
    expect(container).toBeEmptyDOMElement();
  });
});
