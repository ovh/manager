import { render } from '@testing-library/react';

import { RegionTile } from '../RegionTile';

describe('RegionTile', () => {
  it('should display some information about a region in a tile', () => {
    // Given
    const ipv4List = ['192.166.0.0/32', '192.169.0.0/28'];
    const ipv6List = ['2001:41d0:b00:1b00::/56'];

    // When
    const component = render(
      <RegionTile
        region="eu-south-mil"
        bandwidthLimit={10000}
        ipv4List={ipv4List}
        ipv6List={ipv6List}
      />,
    );

    // Then
    expect(component.getByText('eu-south-mil')).toBeVisible();
    expect(component.getByText('10 GB')).toBeVisible();
    expect(component.getByText('192.166.0.0/32')).toBeVisible();
    expect(component.getByText('192.169.0.0/28')).toBeVisible();
    expect(component.getByText('2001:41d0:b00:1b00::/56')).toBeVisible();
  });
});
