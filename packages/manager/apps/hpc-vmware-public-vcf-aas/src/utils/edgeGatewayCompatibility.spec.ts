import { describe, expect, it } from 'vitest';
import {
  VCDDatacentre,
  VCDDatacentreState,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import { isEdgeCompatibleVDC } from './edgeGatewayCompatibility';

describe('isEdgeCompatibleVDC test suite', () => {
  const mockVDC = datacentreList[0];

  const testCases: {
    commercialRange: VCDDatacentreState['commercialRange'];
    expected: boolean;
  }[] = [
    { commercialRange: 'NSX', expected: true },
    { commercialRange: 'STANDARD', expected: false },
    { commercialRange: 'VSAN-NSX', expected: false },
  ];

  it.each(testCases)(
    'return $expected if commercialRange is $commercialRange',
    ({ expected, commercialRange }) => {
      const testVDC: VCDDatacentre = {
        ...mockVDC,
        currentState: { ...mockVDC.currentState, commercialRange },
      };

      expect(isEdgeCompatibleVDC(testVDC)).toBe(expected);
    },
  );
});
