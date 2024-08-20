import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { RegionSummary } from './RegionSummary.component';
import { TLocalisation } from './useRegions';

const mockRegion = {
  name: 'region1',
  macroLabel: 'Macro Label 1',
  microLabel: 'Micro Label 1',
} as TLocalisation;

describe('RegionSummary', () => {
  it('renders macro label correctly', () => {
    const { getByText } = render(<RegionSummary region={mockRegion} />);
    expect(getByText('Macro Label 1')).toBeInTheDocument();
  });

  it('renders micro label correctly', () => {
    const { getByText } = render(<RegionSummary region={mockRegion} />);
    expect(getByText('Micro Label 1')).toBeInTheDocument();
  });

  it('handles missing macro label gracefully', () => {
    const regionWithoutMacroLabel = { ...mockRegion, macroLabel: '' };
    const { queryByText } = render(
      <RegionSummary region={regionWithoutMacroLabel} />,
    );
    expect(queryByText('Macro Label 1')).not.toBeInTheDocument();
  });

  it('handles missing micro label gracefully', () => {
    const regionWithoutMicroLabel = { ...mockRegion, microLabel: '' };
    const { queryByText } = render(
      <RegionSummary region={regionWithoutMicroLabel} />,
    );
    expect(queryByText('Micro Label 1')).not.toBeInTheDocument();
  });
});
