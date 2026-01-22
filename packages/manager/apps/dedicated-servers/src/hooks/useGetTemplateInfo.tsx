import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getTemplateInfosQueryKey,
  getTemplateInfos,
} from '@/data/api/templateInfo';
import { TemplateInfo } from '@/data/types/templateInfo.type';

export const useGetTemplateInfos = () => {
  const { data: templateInfosResponse, isLoading, isError, error } = useQuery<
    ApiResponse<TemplateInfo[]>,
    ApiError
  >({
    queryKey: getTemplateInfosQueryKey,
    queryFn: () => getTemplateInfos(),
  });

  const templateList = templateInfosResponse?.data.map(
    ({ templateName, description }) => ({ templateName, description }),
  );

  return { templateList, isLoading, isError, error };
};
