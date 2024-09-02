import { screen } from '@testing-library/react';
import { render } from '../../utils/test.provider';
import { Region, RegionProps } from './region.component';
import { DemoRegion, DemoDatacenter } from './region.stories';
import translatedRegion from './translations/region/Messages_fr_FR.json';

const renderComponent = (props: RegionProps) => {
  return render(<Region {...props} />);
};

describe('Region component', () => {
  it('renders region correctly for region key', async () => {
    renderComponent({
      ...DemoRegion.args,
    });
    const regionElement = screen.getByText(
      translatedRegion[`region_${DemoRegion.args.name}`],
    );
    expect(regionElement).toBeVisible();
  });

  it('renders region correctly for datacenter key', async () => {
    renderComponent({
      ...DemoDatacenter.args,
    });
    const regionElement = screen.getByText('Roubaix (RBX2) - France');
    expect(regionElement).toBeVisible();
  });
});
