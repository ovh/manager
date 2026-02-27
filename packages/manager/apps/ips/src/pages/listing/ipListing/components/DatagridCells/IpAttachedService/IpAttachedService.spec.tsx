import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import { IpDetails } from '@/data/api';
import { getLinkByHref } from '@/test-utils';
import '@/test-utils/setupUnitTests';

import { IpAttachedService } from './IpAttachedService';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipDetails: undefined as IpDetails | undefined,
    loading: true,
  })),
);

const useMoveIpTasksMocks = vi.hoisted(() =>
  vi.fn(() => ({ hasOnGoingMoveIpTask: false, isTasksLoading: false })),
);

const useVrackMoveTasksMock = vi.hoisted(() =>
  vi.fn(() => ({
    isVrackTasksLoading: false,
    hasOnGoingVrackMoveTasks: false,
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useMoveIpTasks: useMoveIpTasksMocks,
  useVrackMoveTasks: useVrackMoveTasksMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

const shellContext = {
  environment: {
    user: { ovhSubsidiary: 'FR' },
  },
  shell: {
    tracking: {
      trackClick: vi.fn(),
      trackPage: vi.fn(),
      init: vi.fn(),
    },
    navigation: {
      getURL: vi.fn().mockResolvedValue('link-to-service'),
    },
  },
};

/** RENDER */
const renderComponent = (params) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <IpAttachedService {...params} />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('IpAttachedService Component', () => {
  it('Should display routed service with link to service', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[3] as IpDetails,
      loading: false,
    });
    const { container } = renderComponent({
      ip: ipDetailsList[3]?.ip,
    });
    const link = await getLinkByHref({
      container,
      href: 'link-to-service',
      label: ipDetailsList[3]?.routedTo.serviceName,
    });
    expect(link).toBeDefined();
  });
});
