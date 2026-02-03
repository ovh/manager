import { useEffect, useState } from 'react';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

import { useParam } from '@ovh-ux/manager-pci-common';

import { TNetworkRegion } from '@/api/data/network';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import { useAvailablePrivateNetworks, useListGateways } from '@/api/hooks/useNetwork';
import LoadBalancerSelect from '@/components/create/LoadBalancerSelect.component';
import PrivateNetworkSelect from '@/components/create/PrivateNetworkSelect.component';
import SubnetSelect from '@/components/create/SubnetSelect.component';
import {
  GatewaySelector,
  GatewaySelectorState,
} from '@/components/network/GatewaySelector.component';
import { LoadBalancerWarning } from '@/components/network/LoadBalancerWarning.component';
import MultiZoneInfo from '@/components/network/MultiZoneInfo.component';
import NoGatewayLinkedMessage from '@/components/network/NoGatewayLinkedWarning.component';
import { isStandardPlan } from '@/helpers';
import { isValidGateway } from '@/helpers/networks';
import { DeploymentMode, TClusterPlanEnum } from '@/types';

export type TNetworkFormState = {
  privateNetwork?: TNetworkRegion;
  subnet?: TPrivateNetworkSubnet | null;
  gateway?: GatewaySelectorState;
  loadBalancersSubnet?: TPrivateNetworkSubnet | null;
};

export type NetworkClusterStepProps = {
  region: string;
  type: DeploymentMode;
  plan: TClusterPlanEnum;
  onChange: (networkForm: TNetworkFormState) => void;
};

export default function NetworkClusterStep({
  region,
  type,
  plan,
  onChange,
}: Readonly<NetworkClusterStepProps>) {
  const { projectId } = useParam('projectId');
  const [form, setForm] = useState<TNetworkFormState>({});

  const { data: availablePrivateNetworks, isPending } = useAvailablePrivateNetworks(
    projectId,
    region,
  );

  const { data: gateways, isLoading: isLoadingGateways } = useListGateways(
    projectId,
    region,
    form.subnet?.id,
  );

  useEffect(() => {
    onChange(form);
  }, [form]);

  useEffect(() => {
    setForm((network) => ({
      ...network,
      gateway: { isEnabled: isStandardPlan(plan) && isValidGateway(gateways ?? []) },
    }));
  }, [form.subnet?.id, isLoadingGateways, gateways, plan]);

  const shouldWarnSubnet = form.subnet && !form.subnet?.gatewayIp && !isStandardPlan(plan);

  const shouldWarnLoadBalancerSubnet =
    form.subnet?.gatewayIp &&
    form.loadBalancersSubnet &&
    !form.loadBalancersSubnet?.gatewayIp &&
    !isStandardPlan(plan);

  return (
    <>
      {isPending ? (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} className="block text-center" />
      ) : (
        <>
          <MultiZoneInfo isStandard={isStandardPlan(plan)} />

          {isStandardPlan(plan) && (
            <>
              <NoGatewayLinkedMessage
                plan={plan}
                gateways={gateways}
                network={availablePrivateNetworks ?? []}
              />
            </>
          )}
          <PrivateNetworkSelect
            region={region}
            type={type}
            plan={plan}
            network={form.privateNetwork}
            subnet={form.subnet}
            networks={availablePrivateNetworks}
            onSelect={(privateNetwork) => {
              if (privateNetwork) {
                setForm((network) => ({
                  ...network,
                  privateNetwork,
                  subnet: null,
                  loadBalancersSubnet: null,
                }));
              }
            }}
          />
          {form.privateNetwork && (
            <div>
              <SubnetSelect
                key={form.privateNetwork?.id}
                region={region}
                className="mt-2"
                projectId={projectId}
                privateNetwork={form.privateNetwork}
                onSelect={(subnet) =>
                  setForm((network) => ({
                    ...network,
                    subnet,
                  }))
                }
              />
              {shouldWarnSubnet && <LoadBalancerWarning />}
            </div>
          )}
          {form.privateNetwork && form.subnet && !isStandardPlan(plan) && (
            <>
              <GatewaySelector
                className="mt-2"
                onSelect={(gateway) =>
                  setForm((network) => ({
                    ...network,
                    gateway,
                  }))
                }
              />
              <LoadBalancerSelect
                region={region}
                projectId={projectId}
                network={form.privateNetwork}
                onSelect={(loadBalancersSubnet) =>
                  setForm((network) => ({
                    ...network,
                    loadBalancersSubnet,
                  }))
                }
              />
              {shouldWarnLoadBalancerSubnet && <LoadBalancerWarning />}
            </>
          )}
        </>
      )}
    </>
  );
}
