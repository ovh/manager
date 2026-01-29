import { render } from '@testing-library/react';

import { RegionTile } from '../RegionTile';

describe('RegionTile', () => {
  it('should display some information about a region in a tile', () => {
    // Given / When
    const component = render(
      <RegionTile region="eu-south-mil" bandwidthLimit={10000} ipv4List={[]} ipv6List={[]} />,
    );

    // Then
    expect(component.getByText('eu-south-mil')).toBeVisible();
    expect(component.getByText('10 GB')).toBeVisible();
  });
});
