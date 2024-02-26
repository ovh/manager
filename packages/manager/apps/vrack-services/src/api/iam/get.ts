import { apiClient } from '@ovh-ux/manager-core-api';
import {
  IAMResource,
  IamAuthorizationsRequest,
  IamAuthorizationsResponse,
} from './iam.type';

export const getIamResourceQueryKey = (resourceURNList: string[]) => [
  `get/iam/resource/${resourceURNList.join(',')}`,
];

/**
 * Get the vRack Services
 */
export const getIamResource = async (resourceURNList: string[]) => {
  const params = new URLSearchParams();
  resourceURNList.forEach((urn) => params.append('resourceURN', urn));

  return apiClient.v2.get<IAMResource[]>(
    `/iam/resource${params.size > 0 ? '?' : ''}${params.toString()}`,
  );
};

/**
 * Get the vRack Services
 */
export const getIamResourceAuthorizationCheck = async (
  authorizationsRequest: IamAuthorizationsRequest,
) => {
  return apiClient.v2.post<IAMResource[]>(
    `/iam/resource${authorizationsRequest.resourceURNs[0]}/authorization/check`,
    { actions: authorizationsRequest.actionsPage },
  );
};

export const getIamAuthorizationCheckQuerykey = (resourceURNList: string[]) => {
  if (resourceURNList.length === 0) return [];
  return [`get/iam/authorization/check/${resourceURNList.join(',')}`];
};
export const getIamAuthorizationCheck = async (
  authorizationsRequest: IamAuthorizationsRequest,
) => {
  return apiClient.v2.post<IamAuthorizationsResponse[]>(
    `/iam/authorization/check`,
    {
      actions: authorizationsRequest.actionsPage,
      resourceURNs: authorizationsRequest.resourceURNs,
    },
  );
};
