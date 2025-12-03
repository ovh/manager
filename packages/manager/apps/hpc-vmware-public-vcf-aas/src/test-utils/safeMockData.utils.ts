/**
 * TEMPORARY: to be removed when vcd-api mocks return defined values (or eslint migration)
 * Exports vcd-api mock data with guaranteed defined values
 */
import {
  datacentreList,
  mockVrackSegmentList,
  networkAclList,
  organizationList,
} from '@ovh-ux/manager-module-vcd-api';

const validateDefined = <T>(value: T | undefined, name: string): T => {
  if (value === undefined) {
    throw new Error(`Mock data "${name}" is undefined. Check vcd-api mock configuration.`);
  }
  return value;
};

const vcdOrganizationStandard = organizationList[0];
const vcdOrganizationSuspended = organizationList.find((org) => org.resourceStatus === 'SUSPENDED');

const vcdDatacentreStandard = datacentreList[0];
const vcdDatacentreSuspended = datacentreList.find((vdc) => vdc.resourceStatus === 'SUSPENDED');

const vcdVrackSegmentStandard = mockVrackSegmentList[0];

const vcdAclStandard = networkAclList[0];
const vcdAclNetworkStandard = vcdAclStandard?.currentState.networks[0];

export const SAFE_MOCK_DATA = {
  orgStandard: validateDefined(vcdOrganizationStandard, 'vcdOrganizationStandard'),
  orgSuspended: validateDefined(vcdOrganizationSuspended, 'vcdOrganizationSuspended'),
  vdcStandard: validateDefined(vcdDatacentreStandard, 'vcdDatacentreStandard'),
  vdcSuspended: validateDefined(vcdDatacentreSuspended, 'vcdDatacentreSuspended'),
  vrackSegmentStandard: validateDefined(vcdVrackSegmentStandard, 'vcdVrackSegmentStandard'),
  vcdAclStandard: validateDefined(vcdAclStandard, 'vcdAclStandard'),
  vcdAclNetworkStandard: validateDefined(vcdAclNetworkStandard, 'vcdAclNetworkStandard'),
};
