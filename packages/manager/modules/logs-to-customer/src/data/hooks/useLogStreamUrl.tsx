import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { getLogStreamUrl } from '@/data/api/logStreamUrl';
import { getLogStreamsQueryKey } from '@/data/hooks/useLogStream';
import { Url, UrlTypeEnum } from '@/data/types/dbaas/logs/Logs.type';

export const getLogStreamUrlQueryKey = (serviceName: string, streamId: string) => [
  getLogStreamsQueryKey()[0],
  `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/url`,
];

export const useLogStreamUrl = (
  serviceName: string,
  streamId: string,
): UseQueryResult<{ streamURL: Url | undefined }> => {
  return useQuery<{ streamURL: Url | undefined }>({
    queryKey: getLogStreamUrlQueryKey(serviceName, streamId),
    queryFn: async () => {
      const streamURL = await getLogStreamUrl(serviceName, streamId);
      return {
        streamURL: streamURL.find(({ type }) => type === UrlTypeEnum.GRAYLOG_WEBUI),
      };
    },
  });
};
