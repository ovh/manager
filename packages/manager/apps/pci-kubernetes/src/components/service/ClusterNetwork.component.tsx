import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsSkeleton,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';

import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import { useRegionSubnets } from '@/api/hooks/useSubnets';
import { PROCESSING_STATUS } from '@/constants';
import { isMonoDeploymentZone } from '@/helpers';
import { TKube } from '@/types';

import TileLine from './TileLine.component';

export type ClusterNetworkProps = {
  projectId: string;
  kubeDetail: TKube;
};

export default function ClusterNetwork({ projectId, kubeDetail }: Readonly<ClusterNetworkProps>) {
  const { t } = useTranslation('service');
  const { t: tKubernetes } = useTranslation('kubernetes');
  const editNetworkHref = useHref('./edit-network');

  const { data: subnets, isPending: isSubnetPending } = useRegionSubnets(
    projectId,
    kubeDetail.region,
    kubeDetail.privateNetworkId,
  );

  const { data: regionInformations, isPending: isPendingRegionInformation } = useRegionInformations(
    projectId,
    kubeDetail.region,
  );

  const shouldLoadSubnets = !!kubeDetail.privateNetworkId;

  const shoulShowChangePrivateNetwork =
    regionInformations?.type && isMonoDeploymentZone(regionInformations?.type);

  const ip = kubeDetail?.privateNetworkConfiguration?.defaultVrackGateway;

  const publicNetwork =
    !kubeDetail?.privateNetworkConfiguration ||
    !kubeDetail?.privateNetworkConfiguration?.privateNetworkRoutingAsDefault;

  const privateNetwork = kubeDetail?.privateNetworkConfiguration?.privateNetworkRoutingAsDefault;

  const kubeSubnet = subnets?.find(({ id }) => id === kubeDetail?.nodesSubnetId);
  const kubeLoadBalancerSubnet = subnets?.find(
    ({ id }) => id === kubeDetail?.loadBalancersSubnetId,
  );

  return (
    <OsdsTile className="w-full flex-col shadow-md" inline rounded variant={ODS_TILE_VARIANT.ghost}>
      <div className="flex flex-col w-full">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
          className="mb-5"
        >
          {t('kube_service_cluster_network_tile_title')}
        </OsdsText>
        <OsdsDivider separator />
        <TileLine
          title={t('kube_service_cluster_network_attached')}
          value={
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {!kubeDetail?.privateNetworkId && (
                <span className="block">{t('kube_service_cluster_network_public')}</span>
              )}

              {kubeDetail?.privateNetworkId && (
                <span className="block">{kubeDetail.attachedTo}</span>
              )}

              {kubeDetail?.privateNetworkId && (
                <div>
                  {publicNetwork && (
                    <span className="block">
                      {tKubernetes('pci_kubernetes_network_data_public')}
                    </span>
                  )}
                  {privateNetwork && (
                    <>
                      <span className="block">
                        {tKubernetes('pci_kubernetes_network_data_private')}
                      </span>
                      <span>
                        {tKubernetes('pci_kubernetes_network_data_ip')}:{' '}
                        {ip || tKubernetes('pci_kubernetes_network_data_dhcp')}
                      </span>
                    </>
                  )}
                </div>
              )}
            </OsdsText>
          }
        />
        {shouldLoadSubnets && (
          <>
            {(kubeSubnet || isSubnetPending || isPendingRegionInformation) && (
              <TileLine
                title={t('kube_service_cluster_network_subnet')}
                value={
                  <OsdsText
                    className="mb-4"
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {isSubnetPending && <OsdsSkeleton />}
                    {!isSubnetPending && (
                      <span>
                        {kubeSubnet?.id}
                        {' - '}
                        {kubeSubnet?.cidr}
                      </span>
                    )}
                  </OsdsText>
                }
              />
            )}

            {(kubeLoadBalancerSubnet || isSubnetPending) && (
              <TileLine
                title={t('kube_service_cluster_network_lb_subnet')}
                value={
                  <OsdsText
                    className="mb-4"
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {isSubnetPending && <OsdsSkeleton />}
                    {!isSubnetPending && (
                      <span>
                        {kubeLoadBalancerSubnet?.id}
                        {' - '}
                        {kubeLoadBalancerSubnet?.cidr}
                      </span>
                    )}
                  </OsdsText>
                }
              />
            )}
          </>
        )}

        {shouldLoadSubnets && shoulShowChangePrivateNetwork && (
          <OsdsButton
            data-testid="cluster-network-edit-button"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.ghost}
            size={ODS_BUTTON_SIZE.sm}
            href={editNetworkHref}
            disabled={PROCESSING_STATUS.includes(kubeDetail.status) || undefined}
          >
            {t('kube_service_network_edit')}
          </OsdsButton>
        )}
      </div>
    </OsdsTile>
  );
}
