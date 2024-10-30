import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import * as _useListenerModule from '@/api/hook/useListener';
import * as _usePoolModule from '@/api/hook/usePool';
import { wrapper } from '@/wrapperRenders';
import CreateListener from './Create.page';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from '@/api/data/load-balancer';
import { TLoadBalancerPool } from '@/api/data/pool';

describe('CreateListener component', () => {
  it('renders correctly and matches snapshot', () => {
    vi.spyOn(_usePoolModule, 'useAllLoadBalancerPools').mockReturnValue({
      data: [
        {
          id: '1a2b3c4d',
          name: 'Primary Pool',
          protocol: 'http',
          algorithm: 'ROUND_ROBIN',
          operatingStatus: LoadBalancerOperatingStatusEnum.ONLINE,
          provisioningStatus: LoadBalancerProvisioningStatusEnum.ACTIVE,
          sessionPersistence: {
            type: 'APP_COOKIE',
            cookieName: 'SESSION_ID',
          },
          loadbalancerId: 'lb-001',
          search: 'primary pool for HTTP',
          listenerId: 'listener-123',
        },
        {
          id: '2e3f4g5h',
          name: 'Backup Pool',
          protocol: 'https',
          algorithm: 'LEAST_CONNECTIONS',
          operatingStatus: LoadBalancerOperatingStatusEnum.OFFLINE,
          provisioningStatus: LoadBalancerProvisioningStatusEnum.ERROR,
          sessionPersistence: {
            type: 'SOURCE_IP',
            cookieName: '',
          },
          loadbalancerId: 'lb-002',
          listenerId: 'listener-456',
        },
      ],
    } as UseQueryResult<TLoadBalancerPool[]>);

    vi.spyOn(_useListenerModule, 'useCreateListener').mockReturnValue(({
      createListener: vi.fn(),
      isPending: false,
    } as unknown) as any);

    const { asFragment } = render(<CreateListener />, { wrapper });

    expect(asFragment()).toMatchSnapshot();
  });
});
