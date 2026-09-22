import { useMemo } from 'react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useInstance } from '@/data/hooks/instance/useInstance';
import { selectInstanceDashboard } from '../view-models/selectInstanceDashboard';
import { useDedicatedUrl } from '@/hooks/url/useDedicatedUrl';
import { useTranslation } from 'react-i18next';
import { useRepricingInstancesAvailable } from '@/hooks/repricing/useRepricingInstancesAvailable';
import { useNetworkCatalog } from '@/data/hooks/catalog/useNetworkCatalog';
import { usePrivateNetworks } from '@/data/hooks/configuration/usePrivateNetworks';
import {
  selectPublicIpPrices,
  selectSubnetIdsWithGateway,
} from '@/pages/instances/create/view-models/networksViewModel';

type TUseDashboardArgs = {
  region: string | null;
  instanceId: string;
};

export const useDashboard = ({ region, instanceId }: TUseDashboardArgs) => {
  const projectUrl = useProjectUrl('public-cloud');
  const dedicatedUrl = useDedicatedUrl();
  const { i18n } = useTranslation();
  const hasRepricing = useRepricingInstancesAvailable();

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

  const { data: publicIpPrices = null } = useNetworkCatalog({
    select: selectPublicIpPrices(region),
  });

  const { data: subnetIdsWithGateway = [] } = usePrivateNetworks({
    select: selectSubnetIdsWithGateway,
  });

  return useMemo(
    () => ({
      instance: selectInstanceDashboard(
        { projectUrl, dedicatedUrl },
        locale,
        { hasRepricing, publicIpPrices, subnetIdsWithGateway },
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
      hasRepricing,
      publicIpPrices,
      subnetIdsWithGateway,
      instance,
      pendingTasks,
      isPending,
      error,
    ],
  );
};
