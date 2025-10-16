
import { describe, expect, it } from 'vitest';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { ResourceStatus } from '@/types/Vault.type';
import { getColorVaultStatus } from '../getVaultStatusColor.utils';

describe("getVaultStatusColor function unit test", () => {
  it.each([
    ['CREATING', ODS_BADGE_COLOR.information],
    ['DELETING', ODS_BADGE_COLOR.critical],
    ['ERROR', ODS_BADGE_COLOR.critical],
    ['READY', ODS_BADGE_COLOR.success],
    ['SUSPENDED', ODS_BADGE_COLOR.warning],
    ['UPDATING', ODS_BADGE_COLOR.information],
  ] as const)('should return %s color for %s status', (status: ResourceStatus, expectedColor: ODS_BADGE_COLOR) => {
    const result = getColorVaultStatus(status);
    expect(result).toBe(expectedColor);
  });

  it('should return information color as fallback for undefined status', () => {
    // Testing the fallback behavior when status is not in the mapping
    const invalidStatus = 'INVALID_STATUS' as ResourceStatus;
    const result = getColorVaultStatus(invalidStatus);
    expect(result).toBe(ODS_BADGE_COLOR.information);
  });
});
