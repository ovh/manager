import { useQuery } from '@tanstack/react-query';
import { getLogStreamUrl } from '../api/logStreamUrl';
import { UrlTypeEnum } from '../types/dbaas/logs';

export const getLogStreamUrlQueryKey = (
  serviceName: string,
  streamId: string,
) => [
  'getLogStreamUrl',
  `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/url`,
];

export const useLogStreamUrl = (serviceName: string, streamId: string) => {
  return useQuery({
    queryKey: getLogStreamUrlQueryKey(serviceName, streamId),
    queryFn: async () => {
      const streamURL = await getLogStreamUrl(serviceName, streamId);
      return {
        streamURL: streamURL.data.find(
          ({ type }) => type === UrlTypeEnum.GRAYLOG_WEBUI,
        ),
      };
    },
  });
};
