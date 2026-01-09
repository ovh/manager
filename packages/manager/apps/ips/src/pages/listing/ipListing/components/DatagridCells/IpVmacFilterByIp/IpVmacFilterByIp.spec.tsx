import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MacAddressTypeEnum } from '@/data/api';
import { ListingContext } from '@/pages/listing/listingContext';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

import { IpVmacFilterByIp, IpVmacFilterByIpProps } from './IpVmacFilterByIp';

/** RENDER */
const renderComponent = (params: IpVmacFilterByIpProps) => {
  return render(
    <ListingContext.Provider value={listingContextDefaultParams}>
      <IpVmacFilterByIp {...params} />
    </ListingContext.Provider>,
  );
};

describe('IpVmacFilterByIp Component', () => {
  it('Should display vmac if exist for given ip', async () => {
    const { getByText } = renderComponent({
      ip: '123.123.123.160',
      vmacsWithIp: [
        {
          ip: ['123.123.123.161', '123.123.123.160'],
          macAddress: 'mac',
          type: MacAddressTypeEnum.OVH,
        },
      ],
      isLoading: false,
    });
    await waitFor(() => {
      expect(getByText('mac')).toBeDefined();
    });
  });

  it('Should display - if no vmac exist for given ip', async () => {
    const { getByText } = renderComponent({
      ip: '123.123.123.163',
      vmacsWithIp: [
        {
          ip: ['123.123.123.161', '123.123.123.160'],
          macAddress: 'mac',
          type: MacAddressTypeEnum.OVH,
        },
      ],
      isLoading: false,
    });
    await waitFor(() => {
      expect(getByText('-')).toBeDefined();
    });
  });

  it('Should display nothing if not enabled', async () => {
    const { queryByText } = renderComponent({
      ip: '123.123.123.163',
      vmacsWithIp: [
        {
          ip: ['123.123.123.161', '123.123.123.160'],
          macAddress: 'mac',
          type: MacAddressTypeEnum.OVH,
        },
      ],
      enabled: false,
      isLoading: false,
    });
    await waitFor(() => {
      expect(queryByText('-')).toBeNull();
      expect(queryByText('mac')).toBeNull();
    });
  });
});
