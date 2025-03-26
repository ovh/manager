import { describe, expect, test } from 'vitest';
import { formatDatastore } from './formatDatastore';
import { Datastore, VsanDatastore } from '@/types/datastore.type';

describe('formatDatastore test suite', () => {
  const testDatastore: Datastore = { datastoreId: '1', name: 'store1' };
  const testVsan: VsanDatastore = {
    datastoreId: 2,
    datastoreName: 'vsan1',
    connectionState: 'online',
    clusterId: 99,
    datacenterId: 99,
    spaceFree: 99,
    spaceProvisioned: 99,
    spaceUsed: 99,
    vmTotal: 99,
  };

  test.each([
    {
      datastore: testDatastore,
      datastoreName: testDatastore.name,
      isVsan: false,
    },
    {
      datastore: testVsan,
      datastoreName: testVsan.datastoreName,
      isVsan: true,
    },
  ])(
    'returns a formatted datastore with datastoreName as $datastoreName and isVsan as $isVsan',
    ({ datastore, datastoreName, isVsan }) => {
      const result = formatDatastore(datastore);
      expect(result.datastoreName).toBe(datastoreName);
      expect(result.isVsan).toBe(isVsan);
    },
  );
});
