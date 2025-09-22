import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

import { TNetworkRegion } from '@/api/data/network';
import { TGateway, TPrivateNetworkSubnet } from '@/api/data/subnets';
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
import { isMonoDeploymentZone, isMultiDeploymentZones } from '@/helpers';
import { DeploymentMode } from '@/types';

export type TNetworkFormState = {
  privateNetwork?: TNetworkRegion;
  subnet?: TPrivateNetworkSubnet;
  gateway?: GatewaySelectorState;
  loadBalancersSubnet?: TPrivateNetworkSubnet;
};

export type NetworkClusterStepProps = {
  region: string;
  type: DeploymentMode;
  onChange: (networkForm: TNetworkFormState) => void;
};

export const isValidGateway3AZ = (type: DeploymentMode, gateways: TGateway[]) =>
  isMultiDeploymentZones(type) && Array.isArray(gateways) && gateways.length;

export default function NetworkClusterStep({
  region,
  type,
  onChange,
}: Readonly<NetworkClusterStepProps>) {
  const { projectId } = useParams();
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
      gateway: { isEnabled: !!isValidGateway3AZ(type, gateways) },
    }));
  }, [form.subnet?.id, isLoadingGateways, gateways]);

  const shouldWarnSubnet = form.subnet && !form.subnet?.gatewayIp && !isMultiDeploymentZones(type);

  const shouldWarnLoadBalancerSubnet =
    form.subnet?.gatewayIp &&
    form.loadBalancersSubnet &&
    !form.loadBalancersSubnet?.gatewayIp &&
    !isMultiDeploymentZones(type);

  return (
    <>
      {isPending ? (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} className="block text-center" />
      ) : (
        <>
          {isMultiDeploymentZones(type) && (
            <>
              <MultiZoneInfo />

              <NoGatewayLinkedMessage
                type={type}
                gateways={gateways}
                network={availablePrivateNetworks}
              />
            </>
          )}
          <PrivateNetworkSelect
            region={region}
            type={type}
            network={form.privateNetwork}
            subnet={form.subnet}
            networks={availablePrivateNetworks}
            onSelect={(privateNetwork) => {
              setForm((network) => ({
                ...network,
                privateNetwork,
                subnet: null,
                loadBalancersSubnet: null,
              }));
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
          {form.privateNetwork && form.subnet && isMonoDeploymentZone(type) && (
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
