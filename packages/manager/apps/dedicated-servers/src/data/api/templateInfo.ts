import { apiClient, ApiResponse } from '@ovh-ux/manager-core-api';
import { TemplateInfo } from '../types/templateInfo.type';

export const getTemplateInfosQueryKey = [`get/templateInfos`];

export const getTemplateInfos = async (): Promise<ApiResponse<
  TemplateInfo[]
>> => apiClient.v6.get(`/dedicated/installationTemplate/templateInfos`);
