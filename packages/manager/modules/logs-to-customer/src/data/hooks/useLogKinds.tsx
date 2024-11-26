import { useQuery } from '@tanstack/react-query';
import { getLogKindsv2, getLogKindsv6 } from '../api/logKinds';
import { LogApiVersion } from '../types/apiVersion';
import { ApiUrls } from '../../LogsToCustomer.module';

export const getLogKindsQueryKey = (logKindUrl: string) => [
  'getLogKinds',
  logKindUrl,
];

export const useLogKinds = ({
  logKindUrl,
  apiVersion,
}: {
  logKindUrl: ApiUrls['logKind'];
  apiVersion: LogApiVersion;
}) => {
  const queryFunction = apiVersion === 'v2' ? getLogKindsv2 : getLogKindsv6;

  return useQuery({
    queryKey: getLogKindsQueryKey(logKindUrl),
    queryFn: () => queryFunction(logKindUrl),
  });
};
