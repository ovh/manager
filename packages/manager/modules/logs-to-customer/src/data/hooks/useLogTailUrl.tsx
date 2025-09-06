import { useQuery } from '@tanstack/react-query';

import { ApiUrls } from '../../LogsToCustomer.module';
import { postLogTailUrlv2, postLogTailUrlv6 } from '../api/logTailUrl';
import { LogApiVersion } from '../types/apiVersion';

interface IUseLogTailUrl {
  logTailUrl: ApiUrls['logUrl'];
  logKind?: string;
  apiVersion: LogApiVersion;
}

export const getLogTailUrlQueryKey = ({
  logTailUrl,
  logKind,
}: Omit<IUseLogTailUrl, 'apiVersion'>) => [`postLogUrl`, logTailUrl, logKind];

export const useLogTailUrl = ({ logTailUrl, logKind, apiVersion }: IUseLogTailUrl) => {
  const queryFunction = apiVersion === 'v2' ? postLogTailUrlv2 : postLogTailUrlv6;

  return useQuery({
    queryKey: getLogTailUrlQueryKey({ logTailUrl, logKind }),
    queryFn: () => queryFunction({ logTailUrl, payloadData: { kind: logKind } }),
  });
};
