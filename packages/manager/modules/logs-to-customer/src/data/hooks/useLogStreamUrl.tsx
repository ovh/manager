import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getLogStreamUrl } from '../api/logStreamUrl';
import { Url, UrlTypeEnum } from '../types/dbaas/logs';
import { getLogStreamsQueryKey } from './useLogStream';

export const getLogStreamUrlQueryKey = (
  serviceName: string,
  streamId: string,
) => [
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
        streamURL: streamURL.find(
          ({ type }) => type === UrlTypeEnum.GRAYLOG_WEBUI,
        ),
      };
    },
  });
};
