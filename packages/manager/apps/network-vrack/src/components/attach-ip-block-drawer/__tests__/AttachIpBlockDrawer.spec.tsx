import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { AttachIpBlockDrawer } from '../AttachIpBlockDrawer';

// Mock useQueryClient so that invalidateQueries is a no-op and no real
// React Query internals run asynchronously during tests.
const mockInvalidateQueries = vi.fn();
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
  };
});

// Mock i18n – return the translation key as-is for easy assertions
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// Mock notifications
const mockAddInfo = vi.fn();
const mockAddSuccess = vi.fn();
const mockAddError = vi.fn();
const mockClearNotifications = vi.fn();

vi.mock('@ovh-ux/muk', () => ({
  useNotifications: () => ({
    addInfo: mockAddInfo,
    addSuccess: mockAddSuccess,
    addError: mockAddError,
    clearNotifications: mockClearNotifications,
  }),
}));

// Mock vrack tasks context
const mockTrackTask = vi.fn();
vi.mock('@/contexts/vrack-tasks/useVrackTasks', () => ({
  useVrackTasksContext: () => ({ trackTask: mockTrackTask }),
}));

// Mock attach mutation hooks
const mockAttachIpv4 = vi.fn();
vi.mock('@/hooks/vrack-ip/ipv4/useAttachIpv4ToVrack', () => ({
  useAttachIpv4ToVrack: () => ({ mutate: mockAttachIpv4, isPending: false }),
}));

const mockAttachIpv6 = vi.fn();
vi.mock('@/hooks/vrack-ip/ipv6/useAttachIpv6ToVrack', () => ({
  useAttachIpv6ToVrack: () => ({ mutate: mockAttachIpv6, isPending: false }),
}));

// Mock query key helpers used inside the component
vi.mock('@/hooks/vrack-ip/ipv4/useGetVrackIpv4List', () => ({
  getVrackIpv4ListKey: vi.fn((sn: string) => [`/vrack/${sn}/ip`]),
}));

vi.mock('@/hooks/vrack-ip/ipv6/useGetVrackIpv6List', () => ({
  getVrackIpv6ListKey: vi.fn((sn: string) => [`/vrack/${sn}/ipv6`]),
}));

// Mock eligible services hook (controlled per test via mockGetEligibleServices)
const mockGetEligibleServices = vi.fn();
vi.mock('@/hooks/useGetEligibleServices', () => ({
  useGetEligibleServices: (...args: unknown[]) =>
    mockGetEligibleServices(...args) as EligibleServicesMock,
  getGetEligibleServicesKey: vi.fn((sn: string) => [`/vrack/${sn}/eligibleServices`]),
}));

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const SERVICE_NAME = 'pn-12345';
const REGION = 'eu-west-par';

type EligibleServicesMock = {
  ipv4List: { ip: string; description: string; regions: string[] }[];
  ipv6List: { ip: string; description: string; regions: string[] }[];
  isComplete: boolean;
  isLoading: boolean;
  isFetching: boolean;
};

/**
 * Renders the component inside a fresh QueryClientProvider.
 * Returns the RTL result together with the QueryClient so we can rerender
 * with the same client instance when needed.
 */
const renderDrawer = (initialMock: EligibleServicesMock) => {
  mockGetEligibleServices.mockReturnValue(initialMock);

  return render(<AttachIpBlockDrawer serviceName={SERVICE_NAME} region={REGION} />);
};

/** Simulates completing the fetch cycle so `isWaitingForFreshData` is cleared.
 *
 * The component resets `isWaitingForFreshData` only when `isFetching` transitions
 * from `true → false` (tracked via a ref).  We therefore:
 *   1. Open the drawer while `isFetching` is still `true` (set in the initial mock).
 *   2. Switch the mock to `isFetching: false` and force a rerender, which triggers
 *      the effect that clears the waiting flag.
 */
const simulateFetchComplete = (
  rerender: (ui: React.ReactElement) => void,
  updatedMock: EligibleServicesMock,
) => {
  mockGetEligibleServices.mockReturnValue(updatedMock);
  rerender(<AttachIpBlockDrawer serviceName={SERVICE_NAME} region={REGION} />);
};

const openDrawer = () => {
  act(() => {
    fireEvent.click(screen.getByText('publicIpRouting_region_attach_additional_ip_link'));
  });
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AttachIpBlockDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('drawer title', () => {
    it('displays the attach IP title when the drawer is opened', () => {
      renderDrawer({
        ipv4List: [],
        ipv6List: [],
        isComplete: true,
        isLoading: false,
        isFetching: false,
      });

      openDrawer();

      expect(screen.getByText('publicIpRouting_region_attach_additional_ip_title')).toBeDefined();
    });
  });

  describe('eligible IPs display', () => {
    it('displays eligible IPv4 and IPv6 blocks when available', async () => {
      const ipv4List = [
        { ip: '192.168.0.0/24', description: 'Block A', regions: [REGION] },
        { ip: '10.0.0.0/16', description: 'Block B', regions: [REGION] },
      ];
      const ipv6List = [{ ip: '2001:db8::/32', description: 'IPv6 Block', regions: [REGION] }];

      // Start with isFetching: true so the internal ref is set to true on
      // the first render, enabling the subsequent fetch-complete transition.
      const { rerender } = renderDrawer({
        ipv4List,
        ipv6List,
        isComplete: true,
        isLoading: false,
        isFetching: true,
      });

      openDrawer();

      // Simulate fetch completion → clears isWaitingForFreshData
      simulateFetchComplete(rerender, {
        ipv4List,
        ipv6List,
        isComplete: true,
        isLoading: false,
        isFetching: false,
      });

      await waitFor(() => {
        expect(screen.getByText('192.168.0.0/24')).toBeDefined();
        expect(screen.getByText('10.0.0.0/16')).toBeDefined();
        expect(screen.getByText('2001:db8::/32')).toBeDefined();
      });
    });
  });

  describe('no eligible IPs', () => {
    it('displays the no-IP-found message when no eligible IP blocks are available', async () => {
      const { rerender } = renderDrawer({
        ipv4List: [],
        ipv6List: [],
        isComplete: true,
        isLoading: false,
        isFetching: true,
      });

      openDrawer();

      simulateFetchComplete(rerender, {
        ipv4List: [],
        ipv6List: [],
        isComplete: true,
        isLoading: false,
        isFetching: false,
      });

      await waitFor(() => {
        expect(
          screen.getByText('publicIpRouting_region_attach_additional_ip_no_ip_found'),
        ).toBeDefined();
      });
    });
  });
});
