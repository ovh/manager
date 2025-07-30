import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { IpVmacFilterByIp, IpVmacFilterByIpProps } from './IpVmacFilterByIp';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import { MacAddressTypeEnum } from '@/data/api';

/** RENDER */
const renderComponent = (params: IpVmacFilterByIpProps) => {
  return render(
    <ListingContextProvider>
      <IpVmacFilterByIp {...params} />
    </ListingContextProvider>,
  );
};

describe('IpVmacFilterByIp Component', async () => {
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
