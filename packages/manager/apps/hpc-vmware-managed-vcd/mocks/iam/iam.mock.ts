import { IamCheckResponse } from '@ovh-ux/manager-react-components';
import { organizationList } from '../vcd-organization/vcd-organization.mock';

export const resourceList: IamCheckResponse[] = [
  {
    urn: organizationList[0].iam.urn,
    authorizedActions: [
      'vmwareCloudDirectorBackup:apiovh:get',
      'vmwareCloudDirector:apiovh:organization/get',
      'account:apiovh:iam/resource/edit',
      'account:apiovh:service/terminate',
    ],
    unauthorizedActions: [],
  },
  {
    urn: organizationList[1].iam.urn,
    authorizedActions: [],
    unauthorizedActions: [
      'vmwareCloudDirectorBackup:apiovh:get',
      'vmwareCloudDirector:apiovh:organization/get',
      'account:apiovh:iam/resource/edit',
      'account:apiovh:service/terminate',
    ],
  },
];
