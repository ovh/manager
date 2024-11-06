import { IamCheckResponse } from '@ovh-ux/manager-react-components';
import { backupList } from '@ovh-ux/manager-module-vcd-api';
import { iamActions } from '../src/veeam-backup.config';

export const iamResponse: IamCheckResponse[] = [
  {
    urn: backupList[0].iam.urn,
    authorizedActions: [
      iamActions.iamResourceEdit,
      iamActions.terminateService,
    ],
    unauthorizedActions: [],
  },
  {
    urn: backupList[1].iam.urn,
    authorizedActions: [
      iamActions.iamResourceEdit,
      iamActions.terminateService,
    ],
    unauthorizedActions: [],
  },
];
