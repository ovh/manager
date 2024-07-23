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
import { useParams } from 'react-router-dom';
import { useKubeDetail } from '@/api/hooks/useKubernetes';
import ClusterStatus from './ClusterStatus.component';

export default function ClusterInformation() {
  const { t } = useTranslation('service');
  const { t: tDetail } = useTranslation('listing');
  const { t: tKubernetes } = useTranslation('kubernetes');

  const { kubeId, projectId } = useParams();
  const { data: kubeDetail, isPending } = useKubeDetail(projectId, kubeId);

  const ip = () => kubeDetail?.privateNetworkConfiguration?.defaultVrackGateway;
  const publicNetwork = () =>
    !kubeDetail?.privateNetworkConfiguration ||
    !kubeDetail?.privateNetworkConfiguration?.privateNetworkRoutingAsDefault;
  const privateNetwork = () =>
    kubeDetail?.privateNetworkConfiguration?.privateNetworkRoutingAsDefault;

  if (isPending) {
    return null;
  }

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

        <div className="flex flex-col mb-3">
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tDetail('kube_list_id')}
          </OsdsText>
          <OsdsClipboard aria-label="clipboard" value={kubeDetail.id} />

          <OsdsDivider separator />

          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('kube_service_name')}
          </OsdsText>
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {kubeDetail.name}
          </OsdsText>

          <OsdsDivider separator />

          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('kube_service_cluster_status')}
          </OsdsText>
          <ClusterStatus status={kubeDetail.status} />

          <OsdsDivider separator />

          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('kube_service_cluster_version')}
          </OsdsText>
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {kubeDetail.version}
          </OsdsText>

          <OsdsDivider separator />

          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('kube_service_cluster_network_attached')}
          </OsdsText>
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            <span className="block">{kubeDetail.attachedTo}</span>

            {publicNetwork() && (
              <span className="block">
                {tKubernetes('pci_kubernetes_network_data_public')}
              </span>
            )}
            {privateNetwork() && (
              <>
                <span className="block">
                  {tKubernetes('pci_kubernetes_network_data_private')}
                </span>
                <span>
                  {tKubernetes('pci_kubernetes_network_data_ip')}:{' '}
                  {ip() || tKubernetes('pci_kubernetes_network_data_dhcp')}
                </span>
                <span></span>
              </>
            )}
          </OsdsText>

          <OsdsDivider separator />

          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('kube_service_cluster_region')}
          </OsdsText>
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {kubeDetail.region}
          </OsdsText>

          <OsdsDivider separator />

          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('kube_service_cluster_nodes_url')}
          </OsdsText>
          <OsdsClipboard aria-label="clipboard" value={kubeDetail.nodesUrl} />
        </div>
      </div>
    </OsdsTile>
  );
}
