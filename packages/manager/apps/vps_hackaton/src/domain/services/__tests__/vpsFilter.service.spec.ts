import { describe, it, expect } from 'vitest';
import {
  filterVpsByName,
  sortVpsBy,
  paginateVps,
  getVpsCount,
  normalizeVpsList,
} from '../vpsFilter.service';
import type { TVps, TVpsList } from '../../entities/vps';

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
    subscription: { creationDate: '', expirationDate: '2025-06-01', autoRenew: true, renewPeriod: null },
  }),
  createMockVps({
    serviceName: 'vps-beta',
    displayName: 'Beta Server',
    state: 'stopped',
    location: { datacenter: 'sbg1', country: 'FR', continent: 'EU' },
    subscription: { creationDate: '', expirationDate: '2025-03-01', autoRenew: false, renewPeriod: null },
  }),
  createMockVps({
    serviceName: 'vps-gamma',
    displayName: 'Gamma Server',
    state: 'installing',
    location: { datacenter: 'bhs1', country: 'CA', continent: 'NA' },
    subscription: { creationDate: '', expirationDate: '2025-01-01', autoRenew: true, renewPeriod: null },
  }),
  createMockVps({
    serviceName: 'vps-delta',
    displayName: 'Delta Server',
    state: 'running',
    location: { datacenter: 'waw1', country: 'PL', continent: 'EU' },
    subscription: { creationDate: '', expirationDate: null, autoRenew: false, renewPeriod: null },
  }),
];

describe('vpsFilter.service', () => {
  describe('filterVpsByName', () => {
    it('should return all VPS when search term is empty', () => {
      const vpsList = createMockVpsList();
      const result = filterVpsByName('')(vpsList);
      expect(result).toHaveLength(4);
    });

    it('should return all VPS when search term is only whitespace', () => {
      const vpsList = createMockVpsList();
      const result = filterVpsByName('   ')(vpsList);
      expect(result).toHaveLength(4);
    });

    it('should filter by displayName case-insensitively', () => {
      const vpsList = createMockVpsList();
      const result = filterVpsByName('alpha')(vpsList);
      expect(result).toHaveLength(1);
      expect(result[0].displayName).toBe('Alpha Server');
    });

    it('should filter by serviceName', () => {
      const vpsList = createMockVpsList();
      const result = filterVpsByName('vps-beta')(vpsList);
      expect(result).toHaveLength(1);
      expect(result[0].serviceName).toBe('vps-beta');
    });

    it('should match partial strings', () => {
      const vpsList = createMockVpsList();
      const result = filterVpsByName('Server')(vpsList);
      expect(result).toHaveLength(4);
    });

    it('should return empty array when no matches found', () => {
      const vpsList = createMockVpsList();
      const result = filterVpsByName('nonexistent')(vpsList);
      expect(result).toHaveLength(0);
    });

    it('should trim search term before matching', () => {
      const vpsList = createMockVpsList();
      const result = filterVpsByName('  alpha  ')(vpsList);
      expect(result).toHaveLength(1);
    });
  });

  describe('sortVpsBy', () => {
    it('should sort by displayName ascending', () => {
      const vpsList = createMockVpsList();
      const result = sortVpsBy('displayName', 'asc')(vpsList);
      expect(result[0].displayName).toBe('Alpha Server');
      expect(result[1].displayName).toBe('Beta Server');
      expect(result[2].displayName).toBe('Delta Server');
      expect(result[3].displayName).toBe('Gamma Server');
    });

    it('should sort by displayName descending', () => {
      const vpsList = createMockVpsList();
      const result = sortVpsBy('displayName', 'desc')(vpsList);
      expect(result[0].displayName).toBe('Gamma Server');
      expect(result[3].displayName).toBe('Alpha Server');
    });

    it('should sort by state', () => {
      const vpsList = createMockVpsList();
      const result = sortVpsBy('state', 'asc')(vpsList);
      expect(result[0].state).toBe('installing');
      expect(result[1].state).toBe('running');
      expect(result[3].state).toBe('stopped');
    });

    it('should sort by datacenter', () => {
      const vpsList = createMockVpsList();
      const result = sortVpsBy('datacenter', 'asc')(vpsList);
      expect(result[0].location.datacenter).toBe('bhs1');
      expect(result[1].location.datacenter).toBe('gra1');
      expect(result[2].location.datacenter).toBe('sbg1');
      expect(result[3].location.datacenter).toBe('waw1');
    });

    it('should sort by expirationDate ascending (nulls at end)', () => {
      const vpsList = createMockVpsList();
      const result = sortVpsBy('expirationDate', 'asc')(vpsList);
      // Empty string sorts first, then dates in order
      expect(result[3].subscription.expirationDate).toBe('2025-06-01');
    });

    it('should not mutate the original array', () => {
      const vpsList = createMockVpsList();
      const originalFirst = vpsList[0];
      sortVpsBy('displayName', 'desc')(vpsList);
      expect(vpsList[0]).toBe(originalFirst);
    });

    it('should default to ascending when direction not specified', () => {
      const vpsList = createMockVpsList();
      const result = sortVpsBy('displayName')(vpsList);
      expect(result[0].displayName).toBe('Alpha Server');
    });
  });

  describe('paginateVps', () => {
    it('should return first page with correct items', () => {
      const vpsList = createMockVpsList();
      const result = paginateVps(1, 2)(vpsList);
      expect(result).toHaveLength(2);
      expect(result[0].serviceName).toBe('vps-alpha');
      expect(result[1].serviceName).toBe('vps-beta');
    });

    it('should return second page correctly', () => {
      const vpsList = createMockVpsList();
      const result = paginateVps(2, 2)(vpsList);
      expect(result).toHaveLength(2);
      expect(result[0].serviceName).toBe('vps-gamma');
      expect(result[1].serviceName).toBe('vps-delta');
    });

    it('should return partial page when fewer items remain', () => {
      const vpsList = createMockVpsList();
      const result = paginateVps(2, 3)(vpsList);
      expect(result).toHaveLength(1);
      expect(result[0].serviceName).toBe('vps-delta');
    });

    it('should return empty array when page exceeds available data', () => {
      const vpsList = createMockVpsList();
      const result = paginateVps(10, 10)(vpsList);
      expect(result).toHaveLength(0);
    });

    it('should return all items when pageSize exceeds list length', () => {
      const vpsList = createMockVpsList();
      const result = paginateVps(1, 100)(vpsList);
      expect(result).toHaveLength(4);
    });
  });

  describe('getVpsCount', () => {
    it('should return correct count for non-empty list', () => {
      const vpsList = createMockVpsList();
      expect(getVpsCount(vpsList)).toBe(4);
    });

    it('should return 0 for empty list', () => {
      expect(getVpsCount([])).toBe(0);
    });
  });

  describe('normalizeVpsList', () => {
    it('should create a Map with serviceName as key', () => {
      const vpsList = createMockVpsList();
      const { byId, allIds } = normalizeVpsList(vpsList);

      expect(byId.size).toBe(4);
      expect(byId.get('vps-alpha')?.displayName).toBe('Alpha Server');
      expect(byId.get('vps-beta')?.displayName).toBe('Beta Server');
    });

    it('should preserve order in allIds array', () => {
      const vpsList = createMockVpsList();
      const { allIds } = normalizeVpsList(vpsList);

      expect(allIds).toEqual(['vps-alpha', 'vps-beta', 'vps-gamma', 'vps-delta']);
    });

    it('should return empty structures for empty list', () => {
      const { byId, allIds } = normalizeVpsList([]);

      expect(byId.size).toBe(0);
      expect(allIds).toHaveLength(0);
    });
  });
});
