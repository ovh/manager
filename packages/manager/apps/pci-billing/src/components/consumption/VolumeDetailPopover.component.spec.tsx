import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import VolumeDetailPopover from './VolumeDetailPopover.component';

describe('VolumeDetailPopover', () => {
  const volumeDetail = {
    totalPrice: '1002',
    volumeId: 'volume-id',
    quantity: 2,
    region: 'region-1',
    type: 'type-1',
    amount: 123456,
    name: 'volume-name',
    status: 'enabled',
  };

  it('matches snapshot', () => {
    const { asFragment } = render(<VolumeDetailPopover row={volumeDetail} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
