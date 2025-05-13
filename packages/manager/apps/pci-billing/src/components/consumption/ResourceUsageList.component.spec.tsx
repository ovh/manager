import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TResourceUsage } from '@/api/hook/useConsumption';
import ResourceUsageList from './ResourceUsageList.component';

describe('ResourceUsageList', () => {
  const mockResourcesUsage = [
    {
      name: 'ip',
      quantity: {
        unit: 'Hour',
        value: 347,
      },
      totalPrice: 0.8675,
      region: 'region',
    },
    {
      name: 'ip',
      quantity: {
        unit: 'Hour',
        value: 347,
      },
      totalPrice: 0.8675,
      region: 'region',
    },
  ] as TResourceUsage[];

  it('matches snapshot with existing resourcesUsage', () => {
    const { asFragment } = render(
      <ResourceUsageList resourcesUsage={mockResourcesUsage} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with empty resourcesUsage', () => {
    const { asFragment } = render(<ResourceUsageList resourcesUsage={[]} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
