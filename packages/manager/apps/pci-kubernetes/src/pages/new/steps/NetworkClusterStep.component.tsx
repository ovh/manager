import { useEffect, useState } from 'react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';

import { useAvailablePrivateNetworks } from '@/api/hooks/useNetwork';
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

  useEffect(() => {
    onChange(form);
  }, [form]);

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
          <PrivateNetworkSelect
            type={type}
            network={form.privateNetwork}
            networks={availablePrivateNetworks}
            onSelect={(privateNetwork) =>
              setForm((network) => ({
                ...network,
                privateNetwork,
                subnet: null,
                loadBalancersSubnet: null,
              }))
            }
          />
          {form.privateNetwork && (
            <div>
              <SubnetSelect
                key={form.privateNetwork?.id}
                region={region}
                className="mt-8"
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
                className="mt-8"
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
