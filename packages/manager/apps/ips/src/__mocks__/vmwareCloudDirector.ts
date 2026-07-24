import { Handler } from '@ovh-ux/manager-core-test-utils';

import {
  VirtualDataCenterCommercialRange,
  VmwareCloudDirectorOrganization,
  VmwareCloudDirectorVirtualDataCenter,
} from '@/data/api';

/**
 * Each organization is keyed by its id and described by the commercialRange of
 * its first virtualDataCenter. Only organizations whose first vDC is `NSX`
 * should appear in the order service selector.
 */
const organizationFirstVdcRange: Record<
  string,
  VirtualDataCenterCommercialRange | undefined
> = {
  // Deliberately not alphabetically ordered to cover the alphabetical sort
  // applied on the VCFaaS services.
  'vcd-org-nsx-2': 'NSX',
  'vcd-org-nsx-1': 'NSX',
  'vcd-org-standard': 'STANDARD',
  'vcd-org-vsan-nsx': 'VSAN-NSX',
  'vcd-org-empty': undefined,
};

/**
 * Human-readable name exposed by `targetSpec.fullName`. When it differs from
 * the organization `id`, the selector shows it as the main label with the `id`
 * as subtitle. `vcd-org-nsx-2` keeps a fullName equal to its id to cover the
 * "id-only" display case.
 */
const organizationFullName: Record<string, string> = {
  'vcd-org-nsx-2': 'vcd-org-nsx-2',
  'vcd-org-nsx-1': 'My VCFaaS organization',
  'vcd-org-standard': 'Standard organization',
  'vcd-org-vsan-nsx': 'vSAN NSX organization',
  'vcd-org-empty': 'Empty organization',
};

export const vmwareCloudDirectorOrganizationMockList: VmwareCloudDirectorOrganization[] =
  Object.keys(organizationFirstVdcRange).map((id) => ({
    id,
    resourceStatus: 'READY',
    currentState: { region: 'eu-west-rbx' },
    targetSpec: { fullName: organizationFullName[id] },
  }));

/**
 * Organizations expected to be listed in the selector (first vDC === NSX),
 * in their expected display order (alphabetical on the service name).
 */
export const vmwareCloudDirectorNsxOrganizationIds = Object.entries(
  organizationFirstVdcRange,
)
  .filter(([, range]) => range === 'NSX')
  .map(([id]) => id)
  .sort((a, b) => a.localeCompare(b));

export type GetVmwareCloudDirectorMocksParams = {
  hasVmwareCloudDirectorError?: boolean;
};

export const getVmwareCloudDirectorMocks = ({
  hasVmwareCloudDirectorError,
}: GetVmwareCloudDirectorMocksParams): Handler[] => [
  {
    url: '/vmwareCloudDirector/organization',
    response: hasVmwareCloudDirectorError
      ? { message: 'organization error' }
      : vmwareCloudDirectorOrganizationMockList,
    status: hasVmwareCloudDirectorError ? 400 : 200,
    api: 'v2',
  },
  {
    url: '/vmwareCloudDirector/organization/:id/virtualDataCenter',
    response: (_request: unknown, params: { id }) => {
      const range = organizationFirstVdcRange[params.id as string];
      const vdcs: VmwareCloudDirectorVirtualDataCenter[] = range
        ? [
            {
              id: `${params.id}-vdc-1`,
              currentState: { commercialRange: range },
            },
          ]
        : [];
      return vdcs;
    },
    api: 'v2',
  },
];
