import { useMemo } from 'react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useInstance } from '@/data/hooks/instance/useInstance';
import { selectInstanceDashboard } from '../view-models/selectInstanceDashboard';
import { useDedicatedUrl } from '@/hooks/url/useDedicatedUrl';
import { useTranslation } from 'react-i18next';
import { useRepricingInstancesAvailable } from '@/hooks/repricing/useRepricingInstancesAvailable';

type TUseDashboardArgs = {
  region: string | null;
  instanceId: string;
};

export const useDashboard = ({ region, instanceId }: TUseDashboardArgs) => {
  const projectUrl = useProjectUrl('public-cloud');
  const dedicatedUrl = useDedicatedUrl();
  const { i18n } = useTranslation();
  const isStoragePriceDisplayed = useRepricingInstancesAvailable();

  const locale = i18n.language.replace('_', '-');

  const { data: instance, isPending, error, pendingTasks } = useInstance({
    region,
    instanceId,
    params: ['withBackups', 'withImage', 'withNetworks', 'withVolumes'],
    queryOptions: {
      gcTime: 0,
      refetchOnWindowFocus: 'always',
    },
  });

  return useMemo(
    () => ({
      instance: selectInstanceDashboard(
        { projectUrl, dedicatedUrl },
        locale,
        isStoragePriceDisplayed,
        instance,
      ),
      pendingTasks,
      isPending,
      error,
    }),
    [
      projectUrl,
      dedicatedUrl,
      locale,
      isStoragePriceDisplayed,
      instance,
      pendingTasks,
      isPending,
      error,
    ],
  );
};
