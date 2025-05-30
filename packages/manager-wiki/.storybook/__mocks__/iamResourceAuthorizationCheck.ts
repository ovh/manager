import { IAM_ACTIONS } from '../../utils/iam.constants';

export const authorizedActions = {
  authorizedActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  unauthorizedActions: IAM_ACTIONS,
};

export const unauthorizedActions = {
  authorizedActions: [],
  unauthorizedActions: IAM_ACTIONS,
};
