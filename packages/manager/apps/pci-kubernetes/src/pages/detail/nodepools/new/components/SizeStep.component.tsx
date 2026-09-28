import { ReactElement, useEffect } from 'react';

import { isStandardPlan } from '@/helpers';
import { nodesAreAssignedPublicIp } from '@/helpers/node-pool';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useFloatingIpsPrice from '@/hooks/useFloatingIpsPrice';
import usePublicIpPrice from '@/hooks/usePublicIpPrice';
import useRepricingInstancesAvailable from '@/hooks/useRepricingInstancesAvailable';
import DeploymentZone from '@/pages/new/steps/node-pool/DeploymentZone.component';
import NodePoolAntiAffinity from '@/pages/new/steps/node-pool/NodePoolAntiAffinity.component';
import NodePoolSize from '@/pages/new/steps/node-pool/NodePoolSize.component';
import PublicConnectivity from '@/pages/new/steps/node-pool/PublicConnectivity.component';
import PublicIpConnectivity from '@/pages/new/steps/node-pool/PublicIpConnectivity.component';
import { TClusterPlanEnum, TSelectedAvailabilityZones } from '@/types';
import { TRegionInformations } from '@/types/region';

import { useNewPoolStore } from '../store';

type TSizeStepProps = {
  regionInformations?: TRegionInformations | null;
  selectedAvailabilityZones: TSelectedAvailabilityZones | null;
  antiAffinity: boolean;
  onAttachFloatingIPs: (value: boolean) => void;
  onAntiAffinityChange: (value: boolean) => void;
  plan?: TClusterPlanEnum;
  region?: string | null;
  hasPrivateNetwork?: boolean;
};

export default function SizeStep({
  regionInformations,
  plan = TClusterPlanEnum.FREE,
  region,
  hasPrivateNetwork,
  antiAffinity,
  onAntiAffinityChange,
}: TSizeStepProps): ReactElement {
  const store = useNewPoolStore();

  const floatingIpPriceData = useFloatingIpsPrice(true, regionInformations?.type ?? null);
  const floatingIpPrice = floatingIpPriceData.price;

  const has3AZFeature = use3AZPlanAvailable();
  const hasRepricing = useRepricingInstancesAvailable();
  const { price: publicIpPrice } = usePublicIpPrice(region ?? null);
  const nodesUsePublicIp = nodesAreAssignedPublicIp({
    hasRepricing,
    plan,
    hasPrivateNetwork: !!hasPrivateNetwork,
  });

  useEffect(() => {
    if (regionInformations?.availabilityZones.length && !store.selectedAvailabilityZones) {
      store.set.selectAvailabilityZones(
        regionInformations?.availabilityZones.map((zone) => ({
          zone,
          checked: false,
        })),
      );
    }
  }, [regionInformations?.availabilityZones, store]);

  return (
    <>
      {store.selectedAvailabilityZones && (
        <div className="mb-8 flex gap-4">
          <DeploymentZone
            multiple={false}
            onSelect={store.set.selectAvailabilityZones}
            availabilityZones={store.selectedAvailabilityZones}
          />
        </div>
      )}
      {has3AZFeature && isStandardPlan(plan) && (
        <PublicConnectivity
          checked={!!store.attachFloatingIps?.enabled}
          onChange={(enabled: boolean) => store.set.attachFloatingIps({ enabled })}
          price={floatingIpPrice}
        />
      )}
      {nodesUsePublicIp && publicIpPrice?.hourFormatted && (
        <PublicIpConnectivity price={publicIpPrice.hourFormatted} />
      )}

      <NodePoolSize
        isAutoscale={store.scaling?.isAutoscale}
        initialScaling={store.scaling?.quantity}
        isMonthlyBilled={store.isMonthlyBilling}
        onScaleChange={store.set.scaling}
        antiAffinity={antiAffinity}
      />
      <NodePoolAntiAffinity
        isChecked={antiAffinity}
        isEnabled={!store.scaling?.isAutoscale}
        onChange={onAntiAffinityChange}
      />
    </>
  );
}
