import { describe, expect, it } from 'vitest';
import { selectSshKeys, TSshKeyData } from '../sshKeysViewModel';
import { TSshKey } from '@/domain/entities/configuration';
import { TMicroRegion } from '@/domain/entities/instancesCatalog';

const createMicroRegion = (
  overrides: Partial<TMicroRegion> = {},
): TMicroRegion => ({
  name: 'GRA1',
  availabilityZones: [],
  isActivable: false,
  isActivated: true,
  isInMaintenance: false,
  macroRegionId: 'GRA',
  ...overrides,
});

const createSshKey = (overrides: Partial<TSshKey> = {}): TSshKey => ({
  name: 'my-key',
  regions: ['GRA1'],
  ...overrides,
});

describe('selectSshKeys', () => {
  it('returns an empty array when microRegion is undefined', () => {
    const select = selectSshKeys(undefined);
    const sshKeys = [createSshKey()];

    expect(select(sshKeys)).toStrictEqual([]);
  });

  it('returns an empty array when sshKeys is undefined', () => {
    const select = selectSshKeys(createMicroRegion());

    expect(select(undefined)).toStrictEqual([]);
  });

  it('returns an empty array when sshKeys is empty', () => {
    const select = selectSshKeys(createMicroRegion());

    expect(select([])).toStrictEqual([]);
  });

  describe('when microRegion is activated', () => {
    const activatedRegion = createMicroRegion({
      name: 'GRA1',
      isActivated: true,
    });

    it('returns only ssh keys matching the micro region', () => {
      const matchingKey = createSshKey({
        name: 'key-gra',
        regions: ['GRA1', 'SBG1'],
      });
      const nonMatchingKey = createSshKey({
        name: 'key-sbg',
        regions: ['SBG1'],
      });

      const result = selectSshKeys(activatedRegion)([
        matchingKey,
        nonMatchingKey,
      ]);

      expect(result).toStrictEqual<TSshKeyData[]>([
        { label: 'key-gra', value: 'key-gra' },
      ]);
    });

    it('returns an empty array when no key matches the region', () => {
      const key = createSshKey({ name: 'key-sbg', regions: ['SBG1'] });

      expect(selectSshKeys(activatedRegion)([key])).toStrictEqual([]);
    });
  });

  describe('when microRegion is not activated', () => {
    const nonActivatedRegion = createMicroRegion({
      name: 'GRA1',
      isActivated: false,
    });

    it('returns all ssh keys regardless of their regions', () => {
      const key1 = createSshKey({ name: 'key-gra', regions: ['GRA1'] });
      const key2 = createSshKey({ name: 'key-sbg', regions: ['SBG1'] });

      const result = selectSshKeys(nonActivatedRegion)([key1, key2]);

      expect(result).toStrictEqual<TSshKeyData[]>([
        { label: 'key-gra', value: 'key-gra' },
        { label: 'key-sbg', value: 'key-sbg' },
      ]);
    });
  });
});
