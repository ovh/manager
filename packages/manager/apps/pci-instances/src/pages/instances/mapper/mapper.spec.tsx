import { describe, expect, test, it } from 'vitest';
import { mapAddressesToListItems } from '.';
import { TAggregatedInstanceAddress } from '@/types/instance/entity.type';
import { getInstanceStatus, severityToStatus } from './status.mapper';
import { TStatus } from '@/types/instance/common.type';

describe('Mapper functions', () => {
  describe('Considering the mapAddressesToListItems function', () => {
    const fakeAddress1: TAggregatedInstanceAddress = {
      gatewayIp: '',
      ip: '123456',
      version: 1,
    };
    const fakeAddress2: TAggregatedInstanceAddress = {
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

  describe('Considering the getInstanceStatus function', () => {
    it.each(
      Object.entries(severityToStatus).flatMap(([key, values]) =>
        values.map((value) => [value, key]),
      ),
    )(
      'should return severity "%s" for status "%s',
      (status, expectedSeverity) => {
        const result = getInstanceStatus(status as TStatus);
        expect(result).toEqual({
          label: status,
          severity: expectedSeverity,
        });
      },
    );

    it('should return severity "info" for unknown status', () => {
      const unknownStatus = 'NOT_A_REAL_STATUS' as TStatus;
      const result = getInstanceStatus(unknownStatus);
      expect(result).toEqual({
        label: unknownStatus,
        severity: 'info',
      });
    });
  });
});
