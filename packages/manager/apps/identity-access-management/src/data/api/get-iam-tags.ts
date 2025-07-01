import { ApiError, ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type IamTagRequest = {
  internalTags?: boolean;
  unassignedResources?: boolean;
  resourceType?: string;
  resourceURN?: string;
};

export enum TagType {
  CUSTOM_TAG = 'custom',
  PREDEFINED_TAG = 'predefined',
  SYSTEM_TAG = 'system',
}

export type IamTagListItem = {
  name: string;
  count: number;
  type: TagType;
};

export type IamTagGroupByKeysItem = {
  key: string;
  values: string[];
};

export type IamTagResponse = {
  list: IamTagListItem[];
  groupByKeys: IamTagGroupByKeysItem[];
};

export type IamTagApiError = {
  class: string;
  details: { QueryID: string };
  message: string;
};

export const getIamTagsQueryKey = (params: IamTagRequest) => [
  `/iam/tags?internalTags=${params.internalTags}&resourcetype=${params.resourceType}&resourceURN=${params.resourceURN}&emptyTags=${params.unassignedResources}`,
];

export const getIamTags = (params: IamTagRequest) => {
  return apiClient.aapi.get<IamTagResponse>('/iam/tags', {
    params,
  });
};
