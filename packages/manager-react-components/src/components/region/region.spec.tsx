import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test.provider';
import { Region, RegionProps } from './region.component';
import translatedRegion from './translations/region/Messages_fr_FR.json';

const renderComponent = (props: RegionProps) => {
  return render(<Region {...props} />);
};

describe('Region component', () => {
  it('renders region correctly for region key', async () => {
    renderComponent({
      mode: 'region',
      name: 'ca-east-bhs',
    });
    const regionElement = screen.getByText(
      translatedRegion[
        `region_${'ca-east-bhs'}` as keyof typeof translatedRegion
      ],
    );
    expect(regionElement).toBeVisible();
  });

  it('renders region correctly for datacenter key', async () => {
    renderComponent({
      mode: 'datacenter',
      name: 'RBX',
      micro: 2,
    });
    const regionElement = screen.getByText('Roubaix (RBX2) - France');
    expect(regionElement).toBeVisible();
  });
});
