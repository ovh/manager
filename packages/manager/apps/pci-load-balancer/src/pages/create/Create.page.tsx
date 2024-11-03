import { OsdsBreadcrumb, OsdsText } from '@ovhcloud/ods-components/react';
import {
  Headers,
  Notifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useHref, useParams } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useEffect, useMemo } from 'react';
import { FLOATING_IP_TYPE } from '@/constants';
import { useCreateStore } from '@/pages/create/store';
import {
  useGetPrivateNetworkSubnets,
  useGetRegionPrivateNetworks,
} from '@/api/hook/useNetwork';
import { useGetFloatingIps } from '@/api/hook/useFloatingIps';
import { useGetSubnetGateways } from '@/api/hook/useGateways';
import { SizeStep } from '@/pages/create/steps/size/SizeStep';
import { RegionStep } from '@/pages/create/steps/region/RegionStep';
import { IpStep } from '@/pages/create/steps/IpStep';
import { NetworkStep } from '@/pages/create/steps/NetworkStep';
import { InstanceStep } from '@/pages/create/steps/InstanceStep';
import { NameStep } from '@/pages/create/steps/NameStep';

export default function CreatePage(): JSX.Element {
  const projectHref = useProjectUrl('public-cloud');

  const backHref = useHref('..');

  const { projectId } = useParams();

  const { t } = useTranslation('octavia-load-balancer');
  const { t: tCreate } = useTranslation('load-balancer/create');

  const store = useCreateStore();

  const { data: project } = useProject();
  const { list: privateNetworksList } = useGetRegionPrivateNetworks(
    projectId,
    store.region?.name,
  );
  const { list: floatingIpsList } = useGetFloatingIps(
    projectId,
    store.region?.name,
  );
  const { data: subnets } = useGetPrivateNetworkSubnets(
    projectId,
    store.region?.name,
    store.privateNetwork?.id,
  );

  const { data: subnetGateways } = useGetSubnetGateways(
    projectId,
    store.region?.name,
    store.subnet?.id,
  );

  const subnetsList = useMemo(() => {
    if (!subnets) {
      return [];
    }
    return store.publicIp?.type !== FLOATING_IP_TYPE.NO_IP
      ? subnets.filter((subnet) => subnet.gatewayIp)
      : subnets;
  }, [subnets, store.publicIp]);

  useEffect(() => {
    store.reset();
    store.set.projectId(projectId);
  }, []);

  useEffect(() => {
    if (floatingIpsList.length > 0) {
      store.set.publicIp(floatingIpsList[0]);
    }
  }, [floatingIpsList]);

  useEffect(() => {
    if (privateNetworksList.length > 0) {
      store.set.privateNetwork(privateNetworksList[0]);
    }
  }, [privateNetworksList]);

  useEffect(() => {
    if (subnetsList.length > 0) {
      store.set.subnet(subnetsList[0]);
    }
  }, [subnetsList]);

  useEffect(() => {
    store.set.gateways(subnetGateways || []);
  }, [subnetGateways]);

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
        <SizeStep />
        <RegionStep />
        <IpStep />
        <NetworkStep />
        <InstanceStep />
        <NameStep />
      </div>
    </>
  );
}
