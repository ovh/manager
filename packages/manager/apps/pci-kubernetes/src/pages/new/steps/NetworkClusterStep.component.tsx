import { useEffect, useState } from 'react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';

import {
  useAvailablePrivateNetworks,
  useListGateways,
} from '@/api/hooks/useNetwork';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import { TNetworkRegion } from '@/api/data/network';

import {
  GatewaySelector,
  GatewaySelectorState,
} from '@/components/network/GatewaySelector.component';
import PrivateNetworkSelect from '@/components/create/PrivateNetworkSelect.component';
import SubnetSelect from '@/components/create/SubnetSelect.component';
import LoadBalancerSelect from '@/components/create/LoadBalancerSelect.component';
import { LoadBalancerWarning } from '@/components/network/LoadBalancerWarning.component';

import { DeploymentMode } from '@/types';
import { isMonoDeploymentZone, isMultiDeploymentZones } from '@/helpers';
import MultiZoneInfo from '@/components/network/MultiZoneInfo.component';
import NoGatewayLinkedMessage from '@/components/network/NoGatewayLinkedWarning.component';

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

export default function NetworkClusterStep({
  region,
  type,
  onChange,
}: Readonly<NetworkClusterStepProps>) {
  const { projectId } = useParams();
  const [form, setForm] = useState<TNetworkFormState>({});

  const {
    data: availablePrivateNetworks,
    isPending,
  } = useAvailablePrivateNetworks(projectId, region);

  const { data: gateways, isLoading: isLoadingGateways } = useListGateways(
    projectId,
    region,
    form.subnet?.id,
  );

  useEffect(() => {
    onChange(form);
  }, [form]);

  const isValidGateway3AZ =
    isMultiDeploymentZones(type) &&
    (!gateways || (Array.isArray(gateways) && gateways?.length));

  useEffect(() => {
    if (isValidGateway3AZ) {
      setForm((network) => ({
        ...network,
        gateway: { isEnabled: true, ip: gateways?.[0]?.id },
      }));
    }
  }, [form.subnet?.id, isLoadingGateways, gateways]);

  const shouldWarnSubnet = form.subnet && !form.subnet?.gatewayIp;

  const shouldWarnLoadBalancerSubnet =
    form.subnet?.gatewayIp &&
    form.loadBalancersSubnet &&
    !form.loadBalancersSubnet?.gatewayIp;

  return (
    <>
      {isPending ? (
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          className="block text-center"
        />
      ) : (
        <>
          {isMultiDeploymentZones(type) && <MultiZoneInfo />}
          {isMultiDeploymentZones(type) && !isValidGateway3AZ && (
            <NoGatewayLinkedMessage />
          )}
          <PrivateNetworkSelect
            region={region}
            type={type}
            network={form.privateNetwork}
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
