import { IamCheckResponse } from '@ovh-ux/manager-react-components';
import { organizationList } from '../vcd-organization/vcd-organization.mock';
import { iamActions } from '@/utils/iam.constants';

export const resourceList: IamCheckResponse[] = [
  {
    urn: organizationList[0].iam.urn,
    authorizedActions: [
      iamActions.vmwareCloudDirectorApiovhOrganizationEdit,
      iamActions.vmwareCloudDirectorApiovhOrganizationVirtualDataCenterEdit,
    ],
    unauthorizedActions: [],
  },
  {
    urn: organizationList[1].iam.urn,
    authorizedActions: [
      iamActions.vmwareCloudDirectorApiovhOrganizationEdit,
      iamActions.vmwareCloudDirectorApiovhOrganizationVirtualDataCenterEdit,
    ],
    unauthorizedActions: [],
  },
];
