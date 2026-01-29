import { describe, it, expect } from 'vitest';
import {
  selectVpsListForView,
  DEFAULT_FILTERS,
  PAGE_SIZE_OPTIONS,
  type TVpsListFilters,
  type TVpsForView,
} from '../vpsList.viewmodel';
import type { TVps, TVpsList } from '@/domain/entities/vps';

const createMockVps = (overrides: Partial<TVps> = {}): TVps => ({
  serviceName: 'vps-test-123',
  displayName: 'Test VPS',
  state: 'running',
  model: {
    name: 'VPS Value',
    offer: 'value',
    version: '2024',
    vcore: 2,
    memory: 4096,
    disk: 80,
    maximumAdditionalIp: 16,
  },
  location: {
    datacenter: 'gra1',
    country: 'FR',
    continent: 'EU',
  },
  network: {
    ipV4: '192.168.1.1',
    ipV6: null,
    netbootMode: 'local',
    slaMonitoring: true,
  },
  distribution: {
    id: 'debian11',
    name: 'Debian 11',
    language: null,
    available: true,
  },
  subscription: {
    creationDate: '2024-01-01T00:00:00Z',
    expirationDate: '2025-01-01T00:00:00Z',
    autoRenew: true,
    renewPeriod: 'P1M',
  },
  zone: 'os-gra1',
  cluster: 'cluster-1',
  keymap: null,
  memoryLimit: 4096,
  offerType: 'ssd',
  monitoringIpBlocks: [],
  ...overrides,
});

const createMockVpsList = (): TVpsList => [
  createMockVps({
    serviceName: 'vps-alpha',
    displayName: 'Alpha Server',
    state: 'running',
    location: { datacenter: 'gra1', country: 'FR', continent: 'EU' },
    network: { ipV4: '10.0.0.1', ipV6: null, netbootMode: 'local', slaMonitoring: true },
    subscription: { creationDate: '', expirationDate: '2025-06-01', autoRenew: true, renewPeriod: null },
  }),
  createMockVps({
    serviceName: 'vps-beta',
    displayName: 'Beta Server',
    state: 'stopped',
    location: { datacenter: 'sbg1', country: 'FR', continent: 'EU' },
    network: { ipV4: '10.0.0.2', ipV6: null, netbootMode: 'local', slaMonitoring: true },
    subscription: { creationDate: '', expirationDate: '2025-03-01', autoRenew: false, renewPeriod: null },
  }),
  createMockVps({
    serviceName: 'vps-gamma',
    displayName: 'Gamma Server',
    state: 'installing',
    location: { datacenter: 'bhs1', country: 'CA', continent: 'NA' },
    network: { ipV4: '', ipV6: null, netbootMode: 'local', slaMonitoring: true },
    subscription: { creationDate: '', expirationDate: '2025-01-01', autoRenew: true, renewPeriod: null },
  }),
  createMockVps({
    serviceName: 'vps-delta',
    displayName: 'Delta Server',
    state: 'running',
    location: { datacenter: 'waw1', country: 'PL', continent: 'EU' },
    network: { ipV4: '10.0.0.4', ipV6: null, netbootMode: 'local', slaMonitoring: true },
    subscription: { creationDate: '', expirationDate: null, autoRenew: false, renewPeriod: null },
  }),
];

describe('vpsList.viewmodel', () => {
  describe('DEFAULT_FILTERS', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_FILTERS).toEqual({
        searchTerm: '',
        sortField: 'displayName',
        sortDirection: 'asc',
        page: 1,
        pageSize: 10,
      });
    });

    it('should not include state filter by default', () => {
      expect(DEFAULT_FILTERS.state).toBeUndefined();
    });
  });

  describe('PAGE_SIZE_OPTIONS', () => {
    it('should contain expected values', () => {
      expect(PAGE_SIZE_OPTIONS).toEqual([10, 25, 50]);
    });
  });

  describe('selectVpsListForView', () => {
    describe('with undefined data', () => {
      it('should return empty result', () => {
        const result = selectVpsListForView(DEFAULT_FILTERS)(undefined);
        expect(result).toEqual({
          items: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: 10,
        });
      });
    });

    describe('with empty data', () => {
      it('should return empty result', () => {
        const result = selectVpsListForView(DEFAULT_FILTERS)([]);
        expect(result).toEqual({
          items: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: 10,
        });
      });
    });

    describe('with data', () => {
      it('should return paginated results with correct structure', () => {
        const vpsList = createMockVpsList();
        const result = selectVpsListForView(DEFAULT_FILTERS)(vpsList);

        expect(result.totalItems).toBe(4);
        expect(result.totalPages).toBe(1);
        expect(result.currentPage).toBe(1);
        expect(result.pageSize).toBe(10);
        expect(result.items).toHaveLength(4);
      });

      it('should map VPS to view model format', () => {
        const vpsList = createMockVpsList();
        const result = selectVpsListForView(DEFAULT_FILTERS)(vpsList);
        const firstItem = result.items[0];

        expect(firstItem).toHaveProperty('serviceName');
        expect(firstItem).toHaveProperty('displayName');
        expect(firstItem).toHaveProperty('state');
        expect(firstItem).toHaveProperty('datacenter');
        expect(firstItem).toHaveProperty('model');
        expect(firstItem).toHaveProperty('ipAddress');
        expect(firstItem).toHaveProperty('expirationDate');
        expect(firstItem).toHaveProperty('formattedExpiration');
      });

      it('should sort by displayName ascending by default', () => {
        const vpsList = createMockVpsList();
        const result = selectVpsListForView(DEFAULT_FILTERS)(vpsList);

        expect(result.items[0].displayName).toBe('Alpha Server');
        expect(result.items[1].displayName).toBe('Beta Server');
        expect(result.items[2].displayName).toBe('Delta Server');
        expect(result.items[3].displayName).toBe('Gamma Server');
      });

      it('should display dash for missing IP address', () => {
        const vpsList = createMockVpsList();
        const result = selectVpsListForView(DEFAULT_FILTERS)(vpsList);
        const gammaVps = result.items.find((v) => v.serviceName === 'vps-gamma');

        expect(gammaVps?.ipAddress).toBe('-');
      });

      it('should display dash for null expiration date', () => {
        const vpsList = createMockVpsList();
        const result = selectVpsListForView(DEFAULT_FILTERS)(vpsList);
        const deltaVps = result.items.find((v) => v.serviceName === 'vps-delta');

        expect(deltaVps?.formattedExpiration).toBe('-');
      });
    });

    describe('filtering', () => {
      it('should filter by search term', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          searchTerm: 'alpha',
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.totalItems).toBe(1);
        expect(result.items[0].displayName).toBe('Alpha Server');
      });

      it('should filter by state', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          state: 'running',
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.totalItems).toBe(2);
        result.items.forEach((item) => {
          expect(item.state).toBe('running');
        });
      });

      it('should combine search and state filters', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          searchTerm: 'alpha',
          state: 'running',
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.totalItems).toBe(1);
        expect(result.items[0].displayName).toBe('Alpha Server');
        expect(result.items[0].state).toBe('running');
      });

      it('should return empty when filter matches nothing', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          state: 'maintenance',
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.totalItems).toBe(0);
        expect(result.items).toHaveLength(0);
      });
    });

    describe('sorting', () => {
      it('should sort by displayName descending', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          sortField: 'displayName',
          sortDirection: 'desc',
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.items[0].displayName).toBe('Gamma Server');
        expect(result.items[3].displayName).toBe('Alpha Server');
      });

      it('should sort by state', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          sortField: 'state',
          sortDirection: 'asc',
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.items[0].state).toBe('installing');
        expect(result.items[3].state).toBe('stopped');
      });

      it('should sort by datacenter', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          sortField: 'datacenter',
          sortDirection: 'asc',
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.items[0].datacenter).toBe('bhs1');
        expect(result.items[1].datacenter).toBe('gra1');
      });

      it('should sort by expirationDate', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          sortField: 'expirationDate',
          sortDirection: 'asc',
        };
        const result = selectVpsListForView(filters)(vpsList);

        // null/empty dates come first when ascending
        expect(result.items[0].expirationDate).toBe(null);
      });
    });

    describe('pagination', () => {
      it('should paginate correctly with page size 2', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          pageSize: 2,
          page: 1,
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.items).toHaveLength(2);
        expect(result.totalItems).toBe(4);
        expect(result.totalPages).toBe(2);
        expect(result.currentPage).toBe(1);
      });

      it('should return second page correctly', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          pageSize: 2,
          page: 2,
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.items).toHaveLength(2);
        expect(result.currentPage).toBe(2);
      });

      it('should return empty page when page exceeds data', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          pageSize: 10,
          page: 5,
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.items).toHaveLength(0);
        expect(result.totalPages).toBe(1);
      });

      it('should calculate totalPages correctly', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          pageSize: 3,
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.totalPages).toBe(2);
      });
    });

    describe('combined operations', () => {
      it('should filter, sort, and paginate in correct order', () => {
        const vpsList = createMockVpsList();
        const filters: TVpsListFilters = {
          ...DEFAULT_FILTERS,
          state: 'running',
          sortField: 'displayName',
          sortDirection: 'desc',
          pageSize: 1,
          page: 1,
        };
        const result = selectVpsListForView(filters)(vpsList);

        expect(result.totalItems).toBe(2);
        expect(result.items).toHaveLength(1);
        expect(result.items[0].displayName).toBe('Delta Server');
      });
    });
  });
});
