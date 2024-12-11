import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import InstanceDetailPopover from './InstanceDetailPopover.component';
import { TInstanceConsumptionDetail } from './useInstanceListColumns';

describe('InstanceDetailPopover', () => {
  const instanceDetail = {
    instanceId: '057ff95a-42df-4678-b574-660e0073c270',
    instanceName: 'InstancedA',
    total: '88.16 €',
    region: 'GRA-STAGING-A',
    reference: 'a10-45',
    imageType: 'linux',
    vmType: 'A10-45',
    isDeleted: false,
    monthlyBilling: null,
    planCode: null,
  } as TInstanceConsumptionDetail;

  it('matches snapshot', () => {
    const { asFragment } = render(
      <InstanceDetailPopover row={instanceDetail} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
