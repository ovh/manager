import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { useActivePanel } from './useActivePanel';
import { DashboardTabItem } from '@/types/DashboardTabItem';
import appConfig from '@/hpc-vmware-vsphere.config';

const { legacyApplication, legacyPath } = appConfig;

const legacyAppBaseUrl = `https://www.ovh.com/#/${legacyApplication}/${legacyPath}`;
const service = {
  name: 'pcc-xxx',
};
const legacyAppServiceBaseUrl = `${legacyAppBaseUrl}/${service.name}`;

const useNavigateMock = vi.fn();

vi.mock(`react-router-dom`, async (reactRouterDom) => {
  const module = await reactRouterDom<typeof import('react-router-dom')>();

  return {
    ...module,
    useNavigate: () => useNavigateMock,
    useLocation: vi.fn(),
  };
});

const tabsList: DashboardTabItem[] = [
  {
    name: 'general_informations',
    title: 'tabs_label_general_informations',
    to: legacyAppServiceBaseUrl,
    isRedirectLegacy: true,
  },
  {
    name: 'datacenters',
    title: 'tabs_label_datacenters',
    to: `${legacyAppServiceBaseUrl}/datacenter`,
    isRedirectLegacy: true,
  },
  {
    name: 'users',
    title: 'tabs_label_users',
    to: `${legacyAppServiceBaseUrl}/users`,
    isRedirectLegacy: true,
  },
  {
    name: 'security',
    title: 'tabs_label_security',
    to: `${legacyAppServiceBaseUrl}/security`,
    isRedirectLegacy: true,
  },
  {
    name: 'operations',
    title: 'tabs_label_operations',
    to: `${legacyAppServiceBaseUrl}/operation`,
    isRedirectLegacy: true,
  },
  {
    name: 'license',
    title: 'tabs_label_license',
    to: `${legacyAppServiceBaseUrl}/license`,
    isRedirectLegacy: true,
  },
  {
    name: 'logs',
    title: 'tabs_label_logs',
    to: '/logs',
    isRedirectLegacy: false,
  },
];

vi.mocked(useLocation).mockReturnValue({
  pathname: '/logs',
  hash: '',
  key: '',
  state: '',
  search: '',
});

describe('useActivePanel test suite', () => {
  it('should return the correct active panel based on the current pathname', () => {
    const { result } = renderHook(() => useActivePanel(tabsList));

    expect(result.current.name).toEqual('logs');
  });
});
