import React from 'react';
import Listing from './index';
import { render, waitFor } from '../../utils/test.provider';
import { RancherService } from '@/api/api.type';

const setupSpecTest = async () =>
  waitFor(() =>
    render(
      <Listing
        data={[
          { id: '123', currentState: { name: 'Rancher1' } } as RancherService,
        ]}
      />,
    ),
  );

describe('Listing Page', () => {
  it('Page should display correctly', async () => {
    const screen = await setupSpecTest();

    const title = screen.getByText('rancherTitle');

    expect(title).not.toBeNull();
  });
});
