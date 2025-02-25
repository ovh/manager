import { describe } from 'vitest';
import { mapAddressesToListItems } from '.';
import { TAddress } from '@/types/instance/entity.type';

describe('Mapper functions', () => {
  describe('Considering the mapAddressesToListItems function', () => {
    const fakeAddress1: TAddress = {
      gatewayIp: '',
      ip: '123456',
      version: 1,
    };
    const fakeAddress2: TAddress = {
      gatewayIp: '',
      ip: '78910',
      version: 2,
    };
    test('Should map given addresses into a list of items', () => {
      const list = mapAddressesToListItems([fakeAddress1, fakeAddress2]);
      expect(list).toStrictEqual([
        { id: fakeAddress1.ip, name: fakeAddress1.ip },
        { id: fakeAddress2.ip, name: fakeAddress2.ip },
      ]);
    });
  });
});
