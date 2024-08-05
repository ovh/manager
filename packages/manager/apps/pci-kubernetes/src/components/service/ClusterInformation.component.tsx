import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsClipboard,
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TKube } from '@/types';
import ClusterStatus from './ClusterStatus.component';
import TileLine from './TileLine.component';

export type ClusterInformationProps = {
  kubeDetail: TKube;
};

export default function ClusterInformation({
  kubeDetail,
}: Readonly<ClusterInformationProps>) {
  const { t } = useTranslation('service');
  const { t: tDetail } = useTranslation('listing');
  const { t: tKubernetes } = useTranslation('kubernetes');
  const { t: tCommon } = useTranslation('common');

  const ip = kubeDetail?.privateNetworkConfiguration?.defaultVrackGateway;
  const publicNetwork =
    !kubeDetail?.privateNetworkConfiguration ||
    !kubeDetail?.privateNetworkConfiguration?.privateNetworkRoutingAsDefault;
  const privateNetwork =
    kubeDetail?.privateNetworkConfiguration?.privateNetworkRoutingAsDefault;

  return (
    <OsdsTile
      className="w-full h-full flex-col shadow-lg opacity-100"
      inline
      rounded
      variant={ODS_TILE_VARIANT.ghost}
    >
      <div className="flex flex-col w-full">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('kube_service_cluster_information')}
        </OsdsText>
        <OsdsDivider separator />

        <TileLine
          title={tDetail('kube_list_id')}
          value={
            <OsdsClipboard aria-label="clipboard" value={kubeDetail.id} data-testid="clusterInformation-clipboardKubeId">
              <span slot="success-message">
                {tCommon('common_clipboard_copied')}
              </span>
            </OsdsClipboard>
          }
        />

        <TileLine
          title={t('kube_service_name')}
          value={
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {kubeDetail.name}
            </OsdsText>
          }
        />

        <TileLine
          title={t('kube_service_cluster_status')}
          value={<ClusterStatus status={kubeDetail.status} />}
        />

        <TileLine
          title={t('kube_service_cluster_version')}
          value={
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {kubeDetail.version}
            </OsdsText>
          }
        />

        <TileLine
          title={t('kube_service_cluster_network_attached')}
          value={
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              <span className="block">{kubeDetail.attachedTo}</span>

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
            </OsdsText>
          }
        />

        <TileLine
          title={t('kube_service_cluster_region')}
          value={
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {kubeDetail.region}
            </OsdsText>
          }
        />

        <TileLine
          title={t('kube_service_cluster_nodes_url')}
          value={
            <OsdsClipboard aria-label="clipboard" data-testid="clusterInformation-clipboardNodeUrls" value={kubeDetail.nodesUrl}>
              <span slot="success-message">
                {tCommon('common_clipboard_copied')}
              </span>
            </OsdsClipboard>
          }
        />
      </div>
    </OsdsTile>
  );
}
