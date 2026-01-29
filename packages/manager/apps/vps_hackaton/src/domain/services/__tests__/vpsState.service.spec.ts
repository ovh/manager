import { describe, it, expect } from 'vitest';
import {
  getVpsStateCategory,
  selectVpsState,
  filterVpsByState,
  filterVpsByStateCategory,
  isVpsActionable,
  canReboot,
  canStop,
  canStart,
  canRescue,
  canReinstall,
  VPS_STATE_CATEGORIES,
} from '../vpsState.service';
import type { TVps, TVpsState, TVpsList } from '../../entities/vps';

const createMockVps = (state: TVpsState): TVps => ({
  serviceName: `vps-${state}`,
  displayName: `VPS ${state}`,
  state,
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
});

const createMixedStateVpsList = (): TVpsList => [
  createMockVps('running'),
  createMockVps('stopped'),
  createMockVps('installing'),
  createMockVps('rebooting'),
  createMockVps('error'),
  createMockVps('rescue'),
];

describe('vpsState.service', () => {
  describe('VPS_STATE_CATEGORIES', () => {
    it('should have all required states mapped', () => {
      const expectedStates: Array<TVpsState> = [
        'running',
        'stopped',
        'installing',
        'maintenance',
        'rebooting',
        'starting',
        'stopping',
        'upgrading',
        'migrating',
        'rescue',
        'rescued',
        'backuping',
        'error',
      ];

      expectedStates.forEach((state) => {
        expect(VPS_STATE_CATEGORIES).toHaveProperty(state);
      });
    });
  });

  describe('getVpsStateCategory', () => {
    it('should return success for running state', () => {
      expect(getVpsStateCategory('running')).toBe('success');
    });

    it('should return error for stopped state', () => {
      expect(getVpsStateCategory('stopped')).toBe('error');
    });

    it('should return error for error state', () => {
      expect(getVpsStateCategory('error')).toBe('error');
    });

    it('should return error for maintenance state', () => {
      expect(getVpsStateCategory('maintenance')).toBe('error');
    });

    it('should return error for stopping state', () => {
      expect(getVpsStateCategory('stopping')).toBe('error');
    });

    it('should return warning for installing state', () => {
      expect(getVpsStateCategory('installing')).toBe('warning');
    });

    it('should return warning for rebooting state', () => {
      expect(getVpsStateCategory('rebooting')).toBe('warning');
    });

    it('should return warning for starting state', () => {
      expect(getVpsStateCategory('starting')).toBe('warning');
    });

    it('should return warning for upgrading state', () => {
      expect(getVpsStateCategory('upgrading')).toBe('warning');
    });

    it('should return warning for migrating state', () => {
      expect(getVpsStateCategory('migrating')).toBe('warning');
    });

    it('should return warning for rescue state', () => {
      expect(getVpsStateCategory('rescue')).toBe('warning');
    });

    it('should return warning for rescued state', () => {
      expect(getVpsStateCategory('rescued')).toBe('warning');
    });

    it('should return warning for backuping state', () => {
      expect(getVpsStateCategory('backuping')).toBe('warning');
    });

    it('should return info for unknown state', () => {
      expect(getVpsStateCategory('unknown' as TVpsState)).toBe('info');
    });
  });

  describe('selectVpsState', () => {
    it('should return the state from a VPS object', () => {
      const vps = createMockVps('running');
      expect(selectVpsState(vps)).toBe('running');
    });
  });

  describe('filterVpsByState', () => {
    it('should filter VPS by running state', () => {
      const vpsList = createMixedStateVpsList();
      const result = filterVpsByState('running')(vpsList);
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('running');
    });

    it('should filter VPS by stopped state', () => {
      const vpsList = createMixedStateVpsList();
      const result = filterVpsByState('stopped')(vpsList);
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('stopped');
    });

    it('should return empty array when no VPS match the state', () => {
      const vpsList = createMixedStateVpsList();
      const result = filterVpsByState('maintenance')(vpsList);
      expect(result).toHaveLength(0);
    });

    it('should return multiple VPS when multiple match', () => {
      const vpsList = [
        createMockVps('running'),
        createMockVps('running'),
        createMockVps('stopped'),
      ];
      const result = filterVpsByState('running')(vpsList);
      expect(result).toHaveLength(2);
    });
  });

  describe('filterVpsByStateCategory', () => {
    it('should filter VPS by success category', () => {
      const vpsList = createMixedStateVpsList();
      const result = filterVpsByStateCategory('success')(vpsList);
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('running');
    });

    it('should filter VPS by error category', () => {
      const vpsList = createMixedStateVpsList();
      const result = filterVpsByStateCategory('error')(vpsList);
      expect(result).toHaveLength(2);
      expect(result.map((v) => v.state)).toContain('stopped');
      expect(result.map((v) => v.state)).toContain('error');
    });

    it('should filter VPS by warning category', () => {
      const vpsList = createMixedStateVpsList();
      const result = filterVpsByStateCategory('warning')(vpsList);
      expect(result).toHaveLength(3);
      expect(result.map((v) => v.state)).toContain('installing');
      expect(result.map((v) => v.state)).toContain('rebooting');
      expect(result.map((v) => v.state)).toContain('rescue');
    });
  });

  describe('isVpsActionable', () => {
    it('should return true for running state', () => {
      expect(isVpsActionable('running')).toBe(true);
    });

    it('should return true for stopped state', () => {
      expect(isVpsActionable('stopped')).toBe(true);
    });

    it('should return false for installing state', () => {
      expect(isVpsActionable('installing')).toBe(false);
    });

    it('should return false for rebooting state', () => {
      expect(isVpsActionable('rebooting')).toBe(false);
    });

    it('should return false for starting state', () => {
      expect(isVpsActionable('starting')).toBe(false);
    });

    it('should return false for stopping state', () => {
      expect(isVpsActionable('stopping')).toBe(false);
    });

    it('should return false for upgrading state', () => {
      expect(isVpsActionable('upgrading')).toBe(false);
    });

    it('should return false for migrating state', () => {
      expect(isVpsActionable('migrating')).toBe(false);
    });

    it('should return false for backuping state', () => {
      expect(isVpsActionable('backuping')).toBe(false);
    });
  });

  describe('canReboot', () => {
    it('should return true for running VPS', () => {
      expect(canReboot(createMockVps('running'))).toBe(true);
    });

    it('should return true for rescue VPS', () => {
      expect(canReboot(createMockVps('rescue'))).toBe(true);
    });

    it('should return true for rescued VPS', () => {
      expect(canReboot(createMockVps('rescued'))).toBe(true);
    });

    it('should return false for stopped VPS', () => {
      expect(canReboot(createMockVps('stopped'))).toBe(false);
    });

    it('should return false for installing VPS', () => {
      expect(canReboot(createMockVps('installing'))).toBe(false);
    });
  });

  describe('canStop', () => {
    it('should return true for running VPS', () => {
      expect(canStop(createMockVps('running'))).toBe(true);
    });

    it('should return false for stopped VPS', () => {
      expect(canStop(createMockVps('stopped'))).toBe(false);
    });

    it('should return false for rescue VPS', () => {
      expect(canStop(createMockVps('rescue'))).toBe(false);
    });
  });

  describe('canStart', () => {
    it('should return true for stopped VPS', () => {
      expect(canStart(createMockVps('stopped'))).toBe(true);
    });

    it('should return false for running VPS', () => {
      expect(canStart(createMockVps('running'))).toBe(false);
    });

    it('should return false for rescue VPS', () => {
      expect(canStart(createMockVps('rescue'))).toBe(false);
    });
  });

  describe('canRescue', () => {
    it('should return true for running VPS', () => {
      expect(canRescue(createMockVps('running'))).toBe(true);
    });

    it('should return true for stopped VPS', () => {
      expect(canRescue(createMockVps('stopped'))).toBe(true);
    });

    it('should return false for rescue VPS', () => {
      expect(canRescue(createMockVps('rescue'))).toBe(false);
    });

    it('should return false for installing VPS', () => {
      expect(canRescue(createMockVps('installing'))).toBe(false);
    });
  });

  describe('canReinstall', () => {
    it('should return true for running VPS', () => {
      expect(canReinstall(createMockVps('running'))).toBe(true);
    });

    it('should return true for stopped VPS', () => {
      expect(canReinstall(createMockVps('stopped'))).toBe(true);
    });

    it('should return false for installing VPS', () => {
      expect(canReinstall(createMockVps('installing'))).toBe(false);
    });

    it('should return false for rescue VPS', () => {
      expect(canReinstall(createMockVps('rescue'))).toBe(false);
    });
  });
});
