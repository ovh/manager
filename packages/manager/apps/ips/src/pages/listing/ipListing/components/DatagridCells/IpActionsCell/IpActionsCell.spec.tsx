import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ActionMenuItem } from '@ovh-ux/manager-react-components';
import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import {
  IpAntihackStateEnum,
  IpAntihackType,
  IpDetails,
  IpGameFirewallStateEnum,
  IpGameFirewallType,
  IpMitigationType,
  IpSpamStateEnum,
  IpSpamType,
} from '@/data/api';
import { IpTypeEnum } from '@/data/constants';
import { ListingContext } from '@/pages/listing/listingContext';

import { IpActionsCell, IpActionsCellParams } from './IpActionsCell';

/** TEST CONSTANTS */
const TEST_IPS = {
  IPV4_SINGLE: '239.99.244.14/32',
  IPV4_ALTERNATIVE: '239.99.262.83/32',
  IPV4_BLOCK: '241.94.186.48/28',
  IPV4_PARENT: '239.99.244.0/24',
  IPV6_VRACK: '2001:41d0:2:899e::1/128',
};

const MENU_ITEM_IDS = {
  EDIT_DESCRIPTION: 0,
  REVERSE_DNS: 1,
  GAME_FIREWALL: 2,
  EDGE_FIREWALL: 3,
  VRACK_SUBNET: 4,
  ADD_VMAC: 5,
  VIEW_VMAC: 6,
  DELETE_VMAC: 7,
  MOVE_ADDITIONAL_IP: 8,
  UNBLOCK_HACKED: 9,
  UNBLOCK_SPAMMED: 10,
  SLICE_BYOIP: 11,
  AGGREGATE_BYOIP: 12,
  TERMINATE_ADDITIONAL: 13,
  TERMINATE_BYOIP: 14,
  UPDATE_IP_BLOCK: 15,
};

const TRANSLATION_KEYS = {
  EDIT_DESCRIPTION: 'listingActionEditDescription',
  ADD_DESCRIPTION: 'listingActionAddDescription',
};

const MOCK_DATA_INDICES = {
  DEFAULT_IPV4: 0,
  ALTERNATIVE_IPV4: 1,
  IP_BLOCK: 3,
  IPV6_VRACK: 4,
};

const SERVICE_NAMES = {
  DEDICATED_SERVER: 'ns123456.ip-239-99-244.net',
  VRACK_SERVICE: 'vrack-service',
};

const TEST_TIMEOUT = 100;

const TEST_DATA = {
  DESCRIPTION: 'test description',
  DATE: '2024-01-01',
  TIMESTAMP: 1234567890,
  LOGS: 'test logs',
  VRACK_URL: 'https://example.com/vrack',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

/** MOCKS */
const useGetIpdetailsMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipDetails: undefined as IpDetails | undefined,
    isLoading: true,
  })),
);

const useGetIpGameFirewallMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipGameFirewall: undefined as IpGameFirewallType | undefined,
    isLoading: false,
  })),
);

const useIpHasForcedMitigationMock = vi.hoisted(() =>
  vi.fn(() => ({ hasForcedMitigation: false, isLoading: false })),
);

const useGetAttachedServicesMock = vi.hoisted(() =>
  vi.fn(() => ({
    hasCloudServiceAttachedToIP: false,
    hasDedicatedServiceAttachedToIp: false,
    hasHousingServiceAttachedToIp: false,
    hasVrackAttachedToIp: false,
    isLoading: false,
  })),
);

const useIpHasVmacMock = vi.hoisted(() =>
  vi.fn(() => ({ isVmacAlreadyExist: false, isLoading: false })),
);

const useIpHasAlertsMock = vi.hoisted(() =>
  vi.fn(() => ({
    hasAlerts: undefined as
      | {
          antihack?: IpAntihackType[];
          spam?: IpSpamType[];
          mitigation?: IpMitigationType[];
        }
      | undefined,
    isLoading: false,
  })),
);

const navigateMockFn = vi.hoisted(() => vi.fn());
const trackClickMockFn = vi.hoisted(() => vi.fn());
const navigateMock = () => navigateMockFn;
const trackClickMock = () => trackClickMockFn;
const searchParamsMock = new URLSearchParams('test=value');

const listingContextDefaultParams = {
  addExpiredIp: vi.fn(),
  expiredIps: [] as string[],
  apiFilter: {},
  setApiFilter: vi.fn(),
  hasNoApiFilter: true,
  onGoingAggregatedIps: [] as string[],
  setOnGoingAggregatedIps: vi.fn(),
  onGoingSlicedIps: [] as string[],
  setOnGoingSlicedIps: vi.fn(),
  onGoingCreatedIps: [] as string[],
  setOnGoingCreatedIps: vi.fn(),
};

const canSliceByoipIpMock = vi.hoisted(() => vi.fn(() => false));
const canAggregateByoipIpMock = vi.hoisted(() => vi.fn(() => false));
const canTerminateByoipIpMock = vi.hoisted(() => vi.fn(() => false));

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpdetailsMock,
  useGetIpGameFirewall: useGetIpGameFirewallMock,
  useIpHasForcedMitigation: useIpHasForcedMitigationMock,
  useGetAttachedServices: useGetAttachedServicesMock,
  useIpHasVmac: useIpHasVmacMock,
  useIpHasAlerts: useIpHasAlertsMock,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: { language: 'fr_FR' },
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...original,
    useNavigate: () => navigateMock(),
    useSearchParams: () => [searchParamsMock, vi.fn()],
    useLocation: vi.fn().mockReturnValue({
      pathname: 'pathname',
    }),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@ovh-ux/manager-react-shell-client')>();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock() }),
  };
});

vi.mock('@/pages/byoip/Byoip.utils', () => ({
  canSliceByoipIp: canSliceByoipIpMock,
  canAggregateByoipIp: canAggregateByoipIpMock,
  canTerminateByoipIp: canTerminateByoipIpMock,
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  ActionMenu: ({
    items,
    isDisabled,
    id,
  }: {
    items: ActionMenuItem[];
    isDisabled: boolean;
    id: string;
  }) => (
    <div data-testid={`action-menu-${id}`} data-disabled={isDisabled}>
      {items?.map((item: ActionMenuItem) => (
        <button
          key={item.id}
          data-testid={`menu-item-${item.id}`}
          data-label={item.label}
          data-disabled={item.isDisabled}
          data-loading={item.isLoading}
          onClick={item.onClick}
        >
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

// Cache shell context at module level to avoid expensive async calls in each test
let cachedShellContext: ShellContextType | null = null;

const renderWithShellContext = (
  params: IpActionsCellParams,
  listingContext: typeof listingContextDefaultParams = listingContextDefaultParams,
  shellContext: ShellContextType | null = cachedShellContext,
) => {
  return render(
    <ShellContext.Provider value={shellContext}>
      <QueryClientProvider client={queryClient}>
        <ListingContext.Provider value={listingContext}>
          <IpActionsCell {...params} />
        </ListingContext.Provider>
      </QueryClientProvider>
    </ShellContext.Provider>,
  );
};

const renderComponent = (
  params: IpActionsCellParams,
  listingContextOverrides?: Partial<typeof listingContextDefaultParams>,
) => {
  const listingContext = {
    ...listingContextDefaultParams,
    ...listingContextOverrides,
  };

  // Use cached context synchronously - it's already initialized in beforeAll
  if (!cachedShellContext) {
    throw new Error(
      'Shell context not initialized. Call initShellContext in beforeAll hook.',
    );
  }

  return renderWithShellContext(params, listingContext);
};

/** HELPER FUNCTIONS */
const setupDefaultMocks = () => {
  useGetIpdetailsMock.mockReturnValue({
    ipDetails: ipDetailsList[MOCK_DATA_INDICES.DEFAULT_IPV4] as IpDetails,
    isLoading: false,
  });
  useGetIpGameFirewallMock.mockReturnValue({
    ipGameFirewall: undefined,
    isLoading: false,
  });
  useIpHasForcedMitigationMock.mockReturnValue({
    hasForcedMitigation: false,
    isLoading: false,
  });
  useGetAttachedServicesMock.mockReturnValue({
    hasCloudServiceAttachedToIP: false,
    hasDedicatedServiceAttachedToIp: false,
    hasHousingServiceAttachedToIp: false,
    hasVrackAttachedToIp: false,
    isLoading: false,
  });
  useIpHasVmacMock.mockReturnValue({
    isVmacAlreadyExist: false,
    isLoading: false,
  });
  useIpHasAlertsMock.mockReturnValue({
    hasAlerts: undefined,
    isLoading: false,
  });
};

const setupIpDetailsMock = (overrides?: Partial<(typeof ipDetailsList)[0]>) => {
  useGetIpdetailsMock.mockReturnValue({
    ipDetails: (overrides
      ? { ...ipDetailsList[MOCK_DATA_INDICES.DEFAULT_IPV4], ...overrides }
      : ipDetailsList[MOCK_DATA_INDICES.DEFAULT_IPV4]) as IpDetails,
    isLoading: false,
  });
};

const setupAttachedServicesMock = (overrides?: {
  hasCloudServiceAttachedToIP?: boolean;
  hasDedicatedServiceAttachedToIp?: boolean;
  hasHousingServiceAttachedToIp?: boolean;
  hasVrackAttachedToIp?: boolean;
}) => {
  useGetAttachedServicesMock.mockReturnValue({
    hasCloudServiceAttachedToIP: false,
    hasDedicatedServiceAttachedToIp: false,
    hasHousingServiceAttachedToIp: false,
    hasVrackAttachedToIp: false,
    isLoading: false,
    ...overrides,
  });
};

const setupAlertsMock = (overrides?: {
  antihack?: IpAntihackType[];
  spam?: IpSpamType[];
  mitigation?: unknown[];
}) => {
  useIpHasAlertsMock.mockReturnValue({
    hasAlerts: {
      antihack: [],
      spam: [],
      mitigation: [],
      ...overrides,
    } as
      | {
          antihack?: IpAntihackType[];
          spam?: IpSpamType[];
          mitigation?: IpMitigationType[];
        }
      | undefined,
    isLoading: false,
  });
};

const getMenuItem = (container: HTMLElement, menuItemId: number) =>
  container.querySelector(`[data-testid="menu-item-${menuItemId}"]`);

const expectMenuItemVisible = (
  container: HTMLElement,
  menuItemId: number,
  label?: string,
) => {
  const menuItem = getMenuItem(container, menuItemId);
  expect(menuItem).toBeInTheDocument();
  if (label) {
    expect(menuItem).toHaveAttribute('data-label', label);
  }
  return menuItem;
};

const expectMenuItemNotVisible = (
  container: HTMLElement,
  menuItemId: number,
) => {
  const menuItem = getMenuItem(container, menuItemId);
  expect(menuItem).not.toBeInTheDocument();
};

const expectMenuItemDisabled = (container: HTMLElement, menuItemId: number) => {
  const menuItem = getMenuItem(container, menuItemId);
  if (!menuItem) {
    throw new Error(`Menu item ${menuItemId} not found`);
  }
  expect(menuItem).toBeInTheDocument();
  expect(menuItem).toHaveAttribute('data-disabled', 'true');
};

const expectActionMenuDisabled = (
  container: HTMLElement,
  disabled: boolean,
) => {
  const actionMenu = container.querySelector(
    '[data-testid*="action-menu-actions-"]',
  );
  if (disabled) {
    expect(actionMenu).toHaveAttribute('data-disabled', 'true');
  } else {
    expect(actionMenu).not.toHaveAttribute('data-disabled', 'true');
  }
};

const setupVrackTest = (
  mockImplementation?: () => Promise<string> | Promise<never>,
) => {
  if (!cachedShellContext) {
    throw new Error('Shell context not initialized');
  }
  const getURLMock = mockImplementation
    ? vi.fn().mockImplementation(mockImplementation)
    : vi.fn().mockResolvedValue(TEST_DATA.VRACK_URL);
  cachedShellContext.shell.navigation.getURL = getURLMock;
  return getURLMock;
};

const waitForMenuItem = async (
  container: HTMLElement,
  menuItemId: number,
  timeout: number = TEST_TIMEOUT,
) => {
  await waitFor(
    () => {
      const menuItem = getMenuItem(container, menuItemId);
      expect(menuItem).toBeInTheDocument();
    },
    { timeout },
  );
  return getMenuItem(container, menuItemId);
};

describe('IpActionsCell Component', () => {
  beforeAll(async () => {
    // Initialize shell context once for all tests
    cachedShellContext = (await initShellContext('ips')) as ShellContextType;
  });

  beforeEach(async () => {
    const getURLMock = vi.fn().mockResolvedValue(TEST_DATA.VRACK_URL);
    (cachedShellContext).shell.navigation.getURL =
      await act(() => getURLMock());
    vi.clearAllMocks();
    navigateMockFn.mockClear();
    trackClickMockFn.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render ActionMenu with correct id for single IP', () => {
      setupDefaultMocks();

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      const actionMenu = container.querySelector(
        '[data-testid*="action-menu-actions-"]',
      );
      expect(actionMenu).toBeInTheDocument();
      expectActionMenuDisabled(container, false);
    });

    it('should disable ActionMenu when IP is expired', () => {
      setupDefaultMocks();

      const { container } = renderComponent(
        { ip: TEST_IPS.IPV4_SINGLE },
        { expiredIps: [TEST_IPS.IPV4_SINGLE] },
      );

      expectActionMenuDisabled(container, true);
    });

    it('should disable ActionMenu when IP is in ongoing created operations', () => {
      setupDefaultMocks();

      const { container } = renderComponent(
        { ip: TEST_IPS.IPV4_SINGLE },
        { onGoingCreatedIps: [TEST_IPS.IPV4_SINGLE] },
      );

      expectActionMenuDisabled(container, true);
    });

    it('should disable ActionMenu when IP is in ongoing aggregated operations', () => {
      setupDefaultMocks();

      const { container } = renderComponent(
        { ip: TEST_IPS.IPV4_SINGLE },
        { onGoingAggregatedIps: [TEST_IPS.IPV4_SINGLE] },
      );

      expectActionMenuDisabled(container, true);
    });

    it('should disable ActionMenu when IP is in ongoing sliced operations', () => {
      setupDefaultMocks();

      const { container } = renderComponent(
        { ip: TEST_IPS.IPV4_SINGLE },
        { onGoingSlicedIps: [TEST_IPS.IPV4_SINGLE] },
      );

      expectActionMenuDisabled(container, true);
    });
  });

  describe('Menu Items - IPv4 Single IP', () => {
    it('should show Edit Description when description exists and no parentIpGroup', () => {
      setupIpDetailsMock({ description: TEST_DATA.DESCRIPTION });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(
        container,
        MENU_ITEM_IDS.EDIT_DESCRIPTION,
        TRANSLATION_KEYS.EDIT_DESCRIPTION,
      );
    });

    it('should show Add Description when no description and no parentIpGroup', () => {
      setupIpDetailsMock({ description: null });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(
        container,
        MENU_ITEM_IDS.EDIT_DESCRIPTION,
        TRANSLATION_KEYS.ADD_DESCRIPTION,
      );
    });

    it('should not show Edit/Add Description when parentIpGroup exists', () => {
      setupDefaultMocks();

      const { container } = renderComponent({
        ip: TEST_IPS.IPV4_SINGLE,
        parentIpGroup: TEST_IPS.IPV4_PARENT,
      });

      expectMenuItemNotVisible(container, MENU_ITEM_IDS.EDIT_DESCRIPTION);
    });

    it('should always show Reverse DNS menu item', () => {
      setupDefaultMocks();

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(container, MENU_ITEM_IDS.REVERSE_DNS);
    });

    it('should show Manage Game Firewall when conditions are met', () => {
      setupIpDetailsMock({
        type: IpTypeEnum.ADDITIONAL,
        routedTo: { serviceName: SERVICE_NAMES.DEDICATED_SERVER },
      });
      setupAttachedServicesMock({ hasDedicatedServiceAttachedToIp: true });

      useGetIpGameFirewallMock.mockReturnValue({
        ipGameFirewall: {
          ipOnGame: '10.0.0.1',
          firewallModeEnabled: true,
          maxRules: 20,
          state: IpGameFirewallStateEnum.OK,
          supportedProtocols: [],
        },
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(container, MENU_ITEM_IDS.GAME_FIREWALL);
    });

    it('should not show Manage Game Firewall when cloud service attached', () => {
      setupDefaultMocks();
      setupAttachedServicesMock({ hasCloudServiceAttachedToIP: true });
      useGetIpGameFirewallMock.mockReturnValue({
        ipGameFirewall: {
          ipOnGame: '10.0.0.1',
          firewallModeEnabled: true,
          maxRules: 20,
          state: IpGameFirewallStateEnum.OK,
          supportedProtocols: [],
        },
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemNotVisible(container, MENU_ITEM_IDS.GAME_FIREWALL);
    });

    it('should show Configure Edge Network Firewall when conditions are met', () => {
      setupDefaultMocks();

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(container, MENU_ITEM_IDS.EDGE_FIREWALL);
    });

    it('should not show Configure Edge Network Firewall when forced mitigation exists', () => {
      setupDefaultMocks();
      useIpHasForcedMitigationMock.mockReturnValue({
        hasForcedMitigation: true,
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemNotVisible(container, MENU_ITEM_IDS.EDGE_FIREWALL);
    });

    it('should show Add Virtual Mac when conditions are met', () => {
      setupIpDetailsMock({
        type: IpTypeEnum.ADDITIONAL,
        routedTo: { serviceName: SERVICE_NAMES.DEDICATED_SERVER },
      });
      setupAttachedServicesMock({ hasDedicatedServiceAttachedToIp: true });
      useIpHasVmacMock.mockReturnValue({
        isVmacAlreadyExist: false,
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      const menuItem = expectMenuItemVisible(container, MENU_ITEM_IDS.ADD_VMAC);
      expect(menuItem).not.toHaveAttribute('data-disabled', 'true');
    });

    it('should disable Add Virtual Mac when no dedicated service', () => {
      setupIpDetailsMock({ type: IpTypeEnum.ADDITIONAL });
      // Override to ensure hasDedicatedServiceAttachedToIp is false
      setupAttachedServicesMock({ hasDedicatedServiceAttachedToIp: false });
      useIpHasVmacMock.mockReturnValue({
        isVmacAlreadyExist: false,
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      const menuItem = getMenuItem(container, MENU_ITEM_IDS.ADD_VMAC);
      expect(menuItem).toBeInTheDocument();
      expect(menuItem).toHaveAttribute('data-disabled', 'true');
    });

    it('should disable Add Virtual Mac when vmac already exists', () => {
      setupIpDetailsMock({
        type: IpTypeEnum.ADDITIONAL,
        routedTo: { serviceName: SERVICE_NAMES.DEDICATED_SERVER },
      });
      setupAttachedServicesMock({ hasDedicatedServiceAttachedToIp: true });
      useIpHasVmacMock.mockReturnValue({
        isVmacAlreadyExist: true,
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemDisabled(container, MENU_ITEM_IDS.ADD_VMAC);
    });

    it('should show View Virtual Mac when vmac exists and dedicated service', () => {
      setupIpDetailsMock({
        type: IpTypeEnum.ADDITIONAL,
        routedTo: { serviceName: SERVICE_NAMES.DEDICATED_SERVER },
      });
      setupAttachedServicesMock({ hasDedicatedServiceAttachedToIp: true });
      useIpHasVmacMock.mockReturnValue({
        isVmacAlreadyExist: true,
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(container, MENU_ITEM_IDS.VIEW_VMAC);
    });

    it('should show Delete Virtual Mac when vmac exists', () => {
      setupIpDetailsMock({ type: IpTypeEnum.ADDITIONAL });
      useIpHasVmacMock.mockReturnValue({
        isVmacAlreadyExist: true,
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(container, MENU_ITEM_IDS.DELETE_VMAC);
    });

    it('should show Move Additional IP when conditions are met', () => {
      setupIpDetailsMock({
        isAdditionalIp: true,
        type: IpTypeEnum.ADDITIONAL,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      const menuItem = getMenuItem(container, MENU_ITEM_IDS.MOVE_ADDITIONAL_IP);
      expect(menuItem).toBeInTheDocument();
      expect(menuItem?.getAttribute('data-label')).toContain('Additional IP');
    });

    it('should not show Move Additional IP when isByoipSlice is true', () => {
      setupIpDetailsMock({
        isAdditionalIp: true,
        type: IpTypeEnum.ADDITIONAL,
      });

      const { container } = renderComponent({
        ip: TEST_IPS.IPV4_SINGLE,
        isByoipSlice: true,
      });

      expectMenuItemNotVisible(container, MENU_ITEM_IDS.MOVE_ADDITIONAL_IP);
    });

    it('should show Unblock Hacked IP when antihack alerts exist', () => {
      setupDefaultMocks();
      setupAlertsMock({
        antihack: [
          {
            ipBlocked: TEST_IPS.IPV4_SINGLE,
            blockedSince: TEST_DATA.DATE,
            state: IpAntihackStateEnum.BLOCKED,
            time: TEST_DATA.TIMESTAMP,
            logs: TEST_DATA.LOGS,
          },
        ],
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(container, MENU_ITEM_IDS.UNBLOCK_HACKED);
      expect(useIpHasAlertsMock).toBeCalledWith({
        ip: TEST_IPS.IPV4_SINGLE,
        subIp: undefined,
        enabled: true,
      });
    });

    it('should not show Unblock Hacked IP when no antihack alerts exist', () => {
      setupDefaultMocks();
      setupAlertsMock();

      const { container } = renderComponent({
        ip: TEST_IPS.IPV4_SINGLE,
        parentIpGroup: TEST_IPS.IPV4_SINGLE,
      });

      expectMenuItemNotVisible(container, MENU_ITEM_IDS.UNBLOCK_HACKED);
      expect(useIpHasAlertsMock).toBeCalledWith({
        ip: TEST_IPS.IPV4_SINGLE,
        subIp: TEST_IPS.IPV4_SINGLE,
        enabled: true,
      });
    });

    it('should show Unblock Spammed IP when spam alerts exist', () => {
      setupDefaultMocks();
      setupAlertsMock({
        spam: [
          {
            ipSpamming: TEST_IPS.IPV4_SINGLE,
            state: IpSpamStateEnum.BLOCKED,
            date: TEST_DATA.DATE,
            time: TEST_DATA.TIMESTAMP,
          },
        ],
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(container, MENU_ITEM_IDS.UNBLOCK_SPAMMED);
      expect(useIpHasAlertsMock).toBeCalledWith({
        ip: TEST_IPS.IPV4_SINGLE,
        subIp: undefined,
        enabled: true,
      });
    });

    it('should not show Unblock Spammed IP when no spam alerts exist', () => {
      setupDefaultMocks();
      setupAlertsMock();

      const { container } = renderComponent({
        ip: TEST_IPS.IPV4_SINGLE,
        parentIpGroup: TEST_IPS.IPV4_SINGLE,
      });

      expectMenuItemNotVisible(container, MENU_ITEM_IDS.UNBLOCK_SPAMMED);
      expect(useIpHasAlertsMock).toBeCalledWith({
        ip: TEST_IPS.IPV4_SINGLE,
        subIp: TEST_IPS.IPV4_SINGLE,
        enabled: true,
      });
    });
  });

  describe('Menu Items - IPv6', () => {
    it('should show Manage Subnet in vRack for IPv6 VRACK type', async () => {
      const ipv6VrackDetails = {
        ...ipDetailsList[MOCK_DATA_INDICES.IPV6_VRACK],
        type: IpTypeEnum.VRACK,
        routedTo: { serviceName: SERVICE_NAMES.VRACK_SERVICE },
      };
      useGetIpdetailsMock.mockReturnValue({
        ipDetails: ipv6VrackDetails as IpDetails,
        isLoading: false,
      });
      setupAttachedServicesMock({
        hasVrackAttachedToIp: true,
      });

      const getURLMock = setupVrackTest();

      const { container } = renderWithShellContext({
        ip: TEST_IPS.IPV6_VRACK,
      });

      await waitFor(
        () => {
          expect(getURLMock).toHaveBeenCalled();
        },
        { timeout: TEST_TIMEOUT },
      );

      expectMenuItemVisible(container, MENU_ITEM_IDS.VRACK_SUBNET);
    });
  });

  describe('Menu Items - BYOIP', () => {
    it('should show Slice BYOIP when canSliceByoipIp returns true', () => {
      setupIpDetailsMock({ bringYourOwnIp: true });
      canSliceByoipIpMock.mockReturnValue(true);
      setupDefaultMocks();

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(container, MENU_ITEM_IDS.SLICE_BYOIP);
    });

    it('should disable Slice BYOIP when IP in ongoing operations', () => {
      setupIpDetailsMock({ bringYourOwnIp: true });
      canSliceByoipIpMock.mockReturnValue(true);

      const { container } = renderComponent(
        { ip: TEST_IPS.IPV4_SINGLE },
        { onGoingSlicedIps: [TEST_IPS.IPV4_SINGLE] },
      );

      expectMenuItemDisabled(container, MENU_ITEM_IDS.SLICE_BYOIP);
    });

    it('should show Aggregate BYOIP when canAggregateByoipIp returns true', () => {
      setupIpDetailsMock({ bringYourOwnIp: true });
      canAggregateByoipIpMock.mockReturnValue(true);

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(container, MENU_ITEM_IDS.AGGREGATE_BYOIP);
    });

    it('should show Terminate Additional IP when conditions are met', () => {
      useGetIpdetailsMock.mockReturnValue({
        ipDetails: {
          ...ipDetailsList[MOCK_DATA_INDICES.ALTERNATIVE_IPV4],
          canBeTerminated: true,
          bringYourOwnIp: false,
          type: IpTypeEnum.ADDITIONAL,
        } as IpDetails,
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_ALTERNATIVE });

      const menuItem = getMenuItem(
        container,
        MENU_ITEM_IDS.TERMINATE_ADDITIONAL,
      );
      expect(menuItem).toBeInTheDocument();
      expect(menuItem?.getAttribute('data-label')).toContain('Additional IP');
    });

    it('should show Terminate BYOIP when canTerminateByoipIp returns true', () => {
      setupIpDetailsMock({ bringYourOwnIp: true });
      canTerminateByoipIpMock.mockReturnValue(true);

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      expectMenuItemVisible(container, MENU_ITEM_IDS.TERMINATE_BYOIP);
    });
  });

  describe('Menu Items - IP Block', () => {
    it('should show Update IP Block Information when conditions are met', () => {
      useGetIpdetailsMock.mockReturnValue({
        ipDetails: {
          ...ipDetailsList[MOCK_DATA_INDICES.IP_BLOCK],
          bringYourOwnIp: false,
          type: IpTypeEnum.ADDITIONAL,
        } as IpDetails,
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_BLOCK });

      expectMenuItemVisible(container, MENU_ITEM_IDS.UPDATE_IP_BLOCK);
    });
  });

  describe('Navigation and Tracking', () => {
    it('should call navigate with correct URL when Reverse DNS is clicked', async () => {
      setupDefaultMocks();

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });
      const user = userEvent.setup();

      const menuItem = (await waitForMenuItem(
        container,
        MENU_ITEM_IDS.REVERSE_DNS,
        TEST_TIMEOUT,
      )) as HTMLElement;
      await user.click(menuItem);

      await waitFor(
        () => {
          expect(navigateMockFn).toHaveBeenCalled();
          expect(navigateMockFn.mock.calls?.[0]?.[0]).toContain(
            'configure-reverse-dns',
          );
        },
        { timeout: TEST_TIMEOUT },
      );
    });

    it('should call trackClick when menu item is clicked', async () => {
      setupDefaultMocks();

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });
      const user = userEvent.setup();

      const menuItem = (await waitForMenuItem(
        container,
        MENU_ITEM_IDS.REVERSE_DNS,
        TEST_TIMEOUT,
      )) as HTMLElement;
      await user.click(menuItem);

      await waitFor(
        () => {
          expect(trackClickMockFn).toHaveBeenCalledWith({
            location: 'datagrid',
            buttonType: 'button',
            actionType: 'action',
            actions: ['configure_reverse-dns'],
          });
        },
        { timeout: TEST_TIMEOUT },
      );
    });

    it('should include search params in navigation URL', async () => {
      setupDefaultMocks();

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });
      const user = userEvent.setup();

      const menuItem = (await waitForMenuItem(
        container,
        MENU_ITEM_IDS.REVERSE_DNS,
        TEST_TIMEOUT,
      )) as HTMLElement;
      await user.click(menuItem);

      await waitFor(
        () => {
          expect(navigateMockFn).toHaveBeenCalled();
          const url = navigateMockFn.mock.calls?.[0]?.[0];
          expect(url).toContain('test=value');
        },
        { timeout: TEST_TIMEOUT },
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle loading state from hooks', () => {
      useGetIpdetailsMock.mockReturnValue({
        ipDetails: undefined,
        isLoading: true,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      const actionMenu = container.querySelector(
        '[data-testid*="action-menu"]',
      );
      expect(actionMenu).toBeInTheDocument();
    });

    it('should handle undefined ipDetails', () => {
      useGetIpdetailsMock.mockReturnValue({
        ipDetails: undefined,
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_SINGLE });

      const actionMenu = container.querySelector(
        '[data-testid*="action-menu"]',
      );
      expect(actionMenu).toBeInTheDocument();
    });

    it('should handle undefined serviceName', () => {
      useGetIpdetailsMock.mockReturnValue({
        ipDetails: {
          ...ipDetailsList[MOCK_DATA_INDICES.ALTERNATIVE_IPV4],
          routedTo: { serviceName: null },
        } as IpDetails,
        isLoading: false,
      });

      const { container } = renderComponent({ ip: TEST_IPS.IPV4_ALTERNATIVE });

      const actionMenu = container.querySelector(
        '[data-testid*="action-menu"]',
      );
      expect(actionMenu).toBeInTheDocument();
    });

    it('should not show alerts menu items when IP is expired', async () => {
      setupDefaultMocks();
      // When IP is expired, useIpHasAlerts is called with enabled: false, so it should return undefined
      useIpHasAlertsMock.mockReturnValue({
        hasAlerts: undefined,
        isLoading: false,
      });

      const { container } = renderComponent(
        { ip: TEST_IPS.IPV4_SINGLE },
        { expiredIps: [TEST_IPS.IPV4_SINGLE] },
      );

      await waitFor(
        () => {
          expectMenuItemNotVisible(container, MENU_ITEM_IDS.UNBLOCK_HACKED);
        },
        { timeout: TEST_TIMEOUT },
      );
    });

    it('should not show alerts menu items when isByoipSlice is true', async () => {
      setupDefaultMocks();
      // When isByoipSlice is true, useIpHasAlerts is called with enabled: false, so it should return undefined
      useIpHasAlertsMock.mockReturnValue({
        hasAlerts: undefined,
        isLoading: false,
      });

      const { container } = renderComponent({
        ip: TEST_IPS.IPV4_SINGLE,
        isByoipSlice: true,
      });

      await waitFor(
        () => {
          expectMenuItemNotVisible(container, MENU_ITEM_IDS.UNBLOCK_HACKED);
        },
        { timeout: TEST_TIMEOUT },
      );
    });
  });

  describe('vRack Page URL Fetching', () => {
    it('should fetch vRack page URL when serviceName exists', async () => {
      const ipv6VrackDetails = {
        ...ipDetailsList[MOCK_DATA_INDICES.IPV6_VRACK],
        type: IpTypeEnum.VRACK,
        routedTo: { serviceName: SERVICE_NAMES.VRACK_SERVICE },
      };
      useGetIpdetailsMock.mockReturnValue({
        ipDetails: ipv6VrackDetails as IpDetails,
        isLoading: false,
      });
      setupAttachedServicesMock({
        hasVrackAttachedToIp: true,
      });

      const getURLMock = setupVrackTest();

      renderWithShellContext({ ip: TEST_IPS.IPV6_VRACK });

      await waitFor(
        () => {
          expect(getURLMock).toHaveBeenCalledWith(
            'dedicated',
            `#/vrack/${SERVICE_NAMES.VRACK_SERVICE}`,
            {},
          );
        },
        { timeout: TEST_TIMEOUT },
      );
    });

    it('should not fetch vRack page URL when serviceName is undefined', async () => {
      useGetIpdetailsMock.mockReturnValue({
        ipDetails: {
          ...ipDetailsList[MOCK_DATA_INDICES.IPV6_VRACK],
          routedTo: { serviceName: null },
        } as IpDetails,
        isLoading: false,
      });

      const getURLMock = setupVrackTest();

      renderWithShellContext({ ip: TEST_IPS.IPV6_VRACK });

      await waitFor(
        () => {
          expect(getURLMock).not.toHaveBeenCalled();
        },
        { timeout: TEST_TIMEOUT },
      );
    });
  });
});
