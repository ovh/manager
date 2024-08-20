import { fireEvent, render } from '@testing-library/react';
import { vi, describe, it } from 'vitest';
import { RegionList } from './RegionList.component';
import { TLocalisation } from './useRegions';

const mockRegions = [
  { name: 'region1' },
  { name: 'region2' },
] as TLocalisation[];

const mockSelectedRegion = {
  name: 'region1',
} as TLocalisation;

const mockOnClick = vi.fn();
const mockRender = (region: TLocalisation) => region.name;

describe('RegionList', () => {
  it('renders all regions', () => {
    const { getByText } = render(
      <RegionList
        regions={mockRegions}
        selectedRegion={mockSelectedRegion}
        onClick={mockOnClick}
        render={mockRender}
      />,
    );
    expect(getByText('region1')).toBeInTheDocument();
    expect(getByText('region2')).toBeInTheDocument();
  });

  it('calls onClick with the correct region', () => {
    const { getByText } = render(
      <RegionList
        regions={mockRegions}
        selectedRegion={mockSelectedRegion}
        onClick={mockOnClick}
        render={mockRender}
      />,
    );
    fireEvent.click(getByText('region2'));
    expect(mockOnClick).toHaveBeenCalledWith(mockRegions[1]);
  });

  it('handles empty regions list gracefully', () => {
    const { queryByText } = render(
      <RegionList
        regions={[]}
        selectedRegion={mockSelectedRegion}
        onClick={mockOnClick}
        render={mockRender}
      />,
    );
    expect(queryByText('region1')).not.toBeInTheDocument();
    expect(queryByText('region2')).not.toBeInTheDocument();
  });
});
