import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud';
import {
  RegionTypeBadge,
  RegionTypeBadgeWithPopover,
} from './RegionTypeBadge.component';

describe('RegionTypeBadge component', () => {
  it('renders 1-AZ badge', () => {
    render(<RegionTypeBadge type={RegionTypeEnum.region} />);
    expect(screen.getByText('1-AZ')).toBeTruthy();
  });

  it('renders 3-AZ badge', () => {
    render(<RegionTypeBadge type={RegionTypeEnum['region-3-az']} />);
    expect(screen.getByText('3-AZ')).toBeTruthy();
  });

  it('renders LocalZone badge', () => {
    render(<RegionTypeBadge type={RegionTypeEnum.localzone} />);
    expect(screen.getByText('LocalZone')).toBeTruthy();
  });

  it('renders ? badge for unknown type', () => {
    render(<RegionTypeBadge type={'unknown-type' as RegionTypeEnum} />);
    expect(screen.getByText('?')).toBeTruthy();
  });
});

describe('RegionTypeBadgeWithPopover component', () => {
  it('renders badge only if showPopover is false', () => {
    render(
      <RegionTypeBadgeWithPopover
        type={RegionTypeEnum.region}
        showPopover={false}
      />,
    );
    expect(screen.getByText('1-AZ')).toBeTruthy();
  });

  it('renders popover description for region', () => {
    render(
      <RegionTypeBadgeWithPopover
        type={RegionTypeEnum.region}
        showPopover={true}
      />,
    );
    expect(screen.getByText('1-AZ')).toBeTruthy();
    expect(screen.getByTestId('region-type-badge-popover')).toBeTruthy();
  });
});
