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
    offerProfile: VCDDatacentreState['offerProfile'];
    expected: boolean;
  }[] = [
    { offerProfile: 'NSX', expected: true },
    { offerProfile: 'STANDARD', expected: false },
    { offerProfile: undefined, expected: false },
  ];

  it.each(testCases)(
    'return $expected if offerProfile is $offerProfile',
    ({ expected, offerProfile }) => {
      const testVDC: VCDDatacentre = {
        ...mockVDC,
        currentState: { ...mockVDC.currentState, offerProfile },
      };

      expect(isEdgeCompatibleVDC(testVDC)).toBe(expected);
    },
  );
});
