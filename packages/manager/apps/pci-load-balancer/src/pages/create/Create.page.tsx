import { OsdsBreadcrumb, OsdsText } from '@ovhcloud/ods-components/react';
import {
  Headers,
  Notifications,
  useMe,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useHref, useParams } from 'react-router-dom';
import { useCatalog, useProject } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useEffect } from 'react';
import { useMedia } from 'react-use';
import { useCreateStore } from './store';
import {
  useGetPrivateNetworkSubnets,
  useGetRegionPrivateNetworks,
} from '@/api/hook/useNetwork';
import { useGetSubnetGateways } from '@/api/hook/useGateways';

import { SizeStep } from './steps/size/SizeStep';
import { RegionStep } from './steps/region/RegionStep';
import { IpStep } from './steps/ip/IpStep';
import { NetworkStep } from './steps/network/NetworkStep';
import { InstanceStep } from './steps/InstanceStep';
import { NameStep } from './steps/NameStep';
import { useGetAddons } from '@/api/hook/useAddons';
import { useGetRegions } from '@/api/hook/useRegions';
import { useGetFloatingIps } from '@/api/hook/useFloatingIps';

export default function CreatePage(): JSX.Element {
  const { me } = useMe();
  const { data: addons, isPending: isAddonsPending } = useGetAddons();
  const isMobile = useMedia(`(max-width: 768px)`);

  const projectHref = useProjectUrl('public-cloud');

  const backHref = useHref('..');

  const { projectId } = useParams();

  const { t } = useTranslation('load-balancer');
  const { t: tCreate } = useTranslation('load-balancer/create');

  const store = useCreateStore();

  const { data: project } = useProject();
  const { data: regions, isPending: isRegionsPending } = useGetRegions(
    projectId,
  );
  const { list: privateNetworksList } = useGetRegionPrivateNetworks(
    projectId,
    store.region?.name,
  );
  const {
    filteredData: filteredFloatingIps,
    filteredDataWithDefaults: filteredFloatingIpsWithDefaults,
    isPending: isFloatingIpsListPending,
  } = useGetFloatingIps(projectId, store.region?.name);
  const { list: subnetsList } = useGetPrivateNetworkSubnets(
    projectId,
    store.region?.name,
    store.privateNetwork?.id,
  );

  const {
    data: subnetGateways,
    isFetching: isSubnetGatewaysFetching,
  } = useGetSubnetGateways(projectId, store.region?.name, store.subnet?.id);

  const { data: catalog } = useCatalog();

  //-----------
  useEffect(() => {
    store.reset();
    store.set.projectId(projectId);
  }, []);

  useEffect(() => {
    if (filteredFloatingIpsWithDefaults.length > 0) {
      store.set.publicIp(filteredFloatingIpsWithDefaults[0]);
    }
  }, [filteredFloatingIpsWithDefaults.length]);

  // Set private network when private networks list changes
  useEffect(() => {
    if (privateNetworksList.length > 0) {
      store.set.privateNetwork(privateNetworksList[0]);
    }
  }, [privateNetworksList]);

  // Set subnet when subnetsList changes
  useEffect(() => {
    if (subnetsList.length > 0) {
      store.set.subnet(subnetsList[0]);
    }
  }, [subnetsList]);

  useEffect(() => {
    store.set.gateways(subnetGateways || []);
  }, [subnetGateways]);

  // Set load balancer name from region name when it changes
  useEffect(() => {
    if (store.region) {
      const date = new Date();
      const maxRandomNumber = 9999;

      store.set.name(
        `LB_${store.addon.code.toUpperCase()}_${
          store.region.name
        }-${date.getDate()}${date.getMonth() + 1}-${(Math.floor(
          Math.random() * maxRandomNumber,
        ) *
          new Date().getMilliseconds()) %
          maxRandomNumber}`,
      );
    }
  }, [store.region]);

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: projectHref,
            label: project?.description,
          },
          {
            href: backHref,
            label: t('octavia_load_balancers'),
          },
          {
            label: tCreate('octavia_load_balancer_create_title'),
          },
        ]}
      />

      <div className="header mt-8">
        <Headers title={tCreate('octavia_load_balancer_create_title')} />
      </div>

      <Notifications />

      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {tCreate('octavia_load_balancer_create_description')}
      </OsdsText>

      <div className="mt-6">
        <SizeStep
          ovhSubsidiary={me?.ovhSubsidiary}
          addons={addons}
          isLoading={isAddonsPending}
        />
        <RegionStep
          isLoading={isRegionsPending}
          regions={regions}
          ovhSubsidiary={me?.ovhSubsidiary}
          isMobile={isMobile}
        />
        <IpStep
          floatingIps={filteredFloatingIps}
          privateNetworksList={privateNetworksList}
          catalog={catalog}
          isLoading={isFloatingIpsListPending}
        />
        <NetworkStep
          subnetsList={subnetsList}
          isLoading={isSubnetGatewaysFetching}
        />
        <InstanceStep />
        <NameStep />
      </div>
    </>
  );
}
