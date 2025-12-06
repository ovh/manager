import { useQuery } from '@tanstack/react-query';
import { getLogKindsV2, getLogKindsV6 } from '@/data/api/logKinds';
import { LogApiVersion } from '@/data/types/apiVersion';
import { ApiUrls } from '@/LogsToCustomer.props';

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
  const queryFunction = apiVersion === 'v2' ? getLogKindsV2 : getLogKindsV6;

  return useQuery({
    queryKey: getLogKindsQueryKey(logKindUrl),
    queryFn: () => queryFunction(logKindUrl),
  });
};
