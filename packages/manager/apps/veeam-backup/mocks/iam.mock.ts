import { IamCheckResponse } from '@ovh-ux/manager-react-components';
import { backupList } from './veeam-backup.mock';

export const iamResponse: IamCheckResponse[] = [
  {
    urn: backupList[0].iam.urn,
    authorizedActions: [
      'account:apiovh:iam/resource/edit',
      'account:apiovh:service/terminate',
    ],
    unauthorizedActions: [],
  },
  {
    urn: backupList[1].iam.urn,
    authorizedActions: [
      'account:apiovh:iam/resource/edit',
      'account:apiovh:service/terminate',
    ],
    unauthorizedActions: [],
  },
];
