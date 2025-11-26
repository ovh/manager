import { ReactElement, useEffect } from 'react';

import useFloatingIpsPrice from '@/hooks/useFloatingIpsPrice';
import DeploymentZone from '@/pages/new/steps/node-pool/DeploymentZone.component';
import NodePoolAntiAffinity from '@/pages/new/steps/node-pool/NodePoolAntiAffinity.component';
import NodePoolSize from '@/pages/new/steps/node-pool/NodePoolSize.component';
import PublicConnectivity from '@/pages/new/steps/node-pool/PublicConnectivity.component';
import { DeploymentMode, TSelectedAvailabilityZones } from '@/types';
import { TRegionInformations } from '@/types/region';

import { useNewPoolStore } from '../store';

type TSizeStepProps = {
  regionInformations?: TRegionInformations | null;
  selectedAvailabilityZones: TSelectedAvailabilityZones | null;
  antiAffinity: boolean;
  onAttachFloatingIPs: (value: boolean) => void;
  onAntiAffinityChange: (value: boolean) => void;
};

export default function SizeStep({
  regionInformations,
  antiAffinity,
  onAntiAffinityChange,
}: TSizeStepProps): ReactElement {
  const store = useNewPoolStore();

  const floatingIpPriceData = useFloatingIpsPrice(true, regionInformations?.type ?? null);
  const floatingIpPrice = floatingIpPriceData.price;
  const isStandardPlan = regionInformations?.type === DeploymentMode.MULTI_ZONES;

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
      {isStandardPlan && (
        <PublicConnectivity
          checked={!!store.attachFloatingIPs?.enabled}
          onChange={(enabled: boolean) => store.set.attachFloatingIPs({ enabled })}
          price={floatingIpPrice}
        />
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
