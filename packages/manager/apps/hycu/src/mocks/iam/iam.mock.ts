import { IamCheckResponse } from '@ovh-ux/manager-react-components';
import { licensesHycu } from '../licenseHycu/licenseHycu.data';
import { IAM_ACTIONS } from '@/utils/iam.constants';

export const resourceList: IamCheckResponse[] = [
  {
    urn: licensesHycu[0].iam.urn,
    authorizedActions: [
      IAM_ACTIONS.licenseHycuApiOvhGet,
      IAM_ACTIONS.licenseHycuApiOvhActivate,
      IAM_ACTIONS.licenseHycuApiOvhRefresh,
      IAM_ACTIONS.licenseHycuApiOvhTerminate,
    ],
    unauthorizedActions: [],
  },
  {
    urn: licensesHycu[1].iam.urn,
    authorizedActions: [],
    unauthorizedActions: [],
  },
];
