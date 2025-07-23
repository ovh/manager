import { useMemo } from 'react';

import { AccountStatistics, ZimbraOffer } from '@/data/api';
import { useOrganization, usePlatform } from '@/data/hooks';

export const useAccountsStatistics = () => {
  const { data: platform, isLoading: isPlatformLoading } = usePlatform();
  const { data: organisation, isLoading: isOrganisationLoading } = useOrganization();
  const accountsStatistics: AccountStatistics[] = useMemo(
    () =>
      organisation
        ? organisation?.currentState?.accountsStatistics
        : platform?.currentState?.accountsStatistics,
    [organisation, platform],
  );

  const { accountsConfigured, accountsUnconfigured, proCount, starterCount } = useMemo(() => {
    return (accountsStatistics || []).reduce(
      (acc, curr) => {
        acc.accountsConfigured += curr.configuredAccountsCount;
        acc.accountsUnconfigured += curr.availableAccountsCount;
        const sum = curr.availableAccountsCount + curr.configuredAccountsCount;
        if (curr.offer === ZimbraOffer.PRO) {
          acc.proCount += sum;
        } else if (curr.offer === ZimbraOffer.STARTER) {
          acc.starterCount += sum;
        }
        return acc;
      },
      {
        accountsConfigured: 0,
        accountsUnconfigured: 0,
        proCount: 0,
        starterCount: 0,
      },
    );
  }, [accountsStatistics]);

  return {
    accountsStatistics,
    accountsConfigured,
    accountsUnconfigured,
    proCount,
    starterCount,
    isLoading: isPlatformLoading || isOrganisationLoading,
  };
};
