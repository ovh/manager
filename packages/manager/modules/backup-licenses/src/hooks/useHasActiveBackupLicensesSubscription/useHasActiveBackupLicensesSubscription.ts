import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/data/queries/queryKeys';

import { checkHasActiveBackupLicensesSubscription } from './checkHasActiveBackupLicensesSubscription';

export const useHasActiveBackupLicensesSubscription = (): UseQueryResult<boolean> =>
  useQuery({
    queryKey: queryKeys.subscription.active(),
    queryFn: checkHasActiveBackupLicensesSubscription,
  });
