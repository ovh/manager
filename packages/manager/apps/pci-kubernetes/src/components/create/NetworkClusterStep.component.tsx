import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { usePrivateNetworkSubnets } from '@/api/hooks/useSubnets';
import { useAvailablePrivateNetworks } from '@/api/hooks/useNetwork';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import { TNetwork } from '@/api/data/network';
import LoadBalancerSelect from './LoadBalancerSelect.component';
import PrivateNetworkSelect from './PrivateNetworkSelect.component';
import PublicPrivateGateway from './PublicPrivateGateway.component';
import SubnetSelect from './SubnetSelect.component';

export type TFormState = {
  regionName: string;
  gatewayIp: string;
  gatewayEnabled: boolean;
  privateNetwork: TNetwork;
  subnet: TPrivateNetworkSubnet;
  loadBalancersSubnet: TPrivateNetworkSubnet;
};

export type NetworkClusterStepProps = {
  formState: TFormState;
  setFormState: (formState) => void;
};

export default function NetworkClusterStep({
  formState,
  setFormState,
}: Readonly<NetworkClusterStepProps>) {
  const { t } = useTranslation('network-add');
  const { projectId } = useParams();

  const {
    data: availablePrivateNetworks,
    isPending,
  } = useAvailablePrivateNetworks(projectId, formState.regionName);

  const {
    subnets,
    subnetsByRegion,
    isLoading: isSubnetsLoading,
    error: subnetError,
  } = usePrivateNetworkSubnets(
    projectId,
    formState.privateNetwork?.id,
    formState.regionName,
  );

  const hasPrivateNetwork = Boolean(formState.privateNetwork?.id);

  const isSubnetShown =
    hasPrivateNetwork && !isSubnetsLoading && !!subnetsByRegion?.length;

  const isGatewayShown = hasPrivateNetwork && !isSubnetsLoading;

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      subnet: subnetsByRegion[0],
      gatewayIp: subnetsByRegion[0]?.gatewayIp || '',
    }));
  }, [subnets, subnetsByRegion]);

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
          <PrivateNetworkSelect
            networks={availablePrivateNetworks}
            formState={formState}
            setFormState={setFormState}
          />

          {isSubnetsLoading && (
            <OsdsSpinner
              inline
              size={ODS_SPINNER_SIZE.md}
              className="block text-center"
            />
          )}

          {isSubnetShown && (
            <SubnetSelect
              subnets={subnetsByRegion}
              formState={formState}
              setFormState={setFormState}
              isLoading={isSubnetsLoading}
              error={subnetError}
            />
          )}

          {isGatewayShown && (
            <PublicPrivateGateway
              formState={formState}
              setFormState={setFormState}
            />
          )}

          {isSubnetShown && (
            <LoadBalancerSelect
              subnets={subnets}
              formState={formState}
              setFormState={setFormState}
              isLoading={isSubnetsLoading}
            />
          )}
        </>
      )}
    </>
  );
}
