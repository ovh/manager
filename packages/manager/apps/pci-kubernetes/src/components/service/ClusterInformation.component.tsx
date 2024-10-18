import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Clipboard } from '@ovh-ux/manager-react-components';
import { TKube } from '@/types';
import ClusterStatus from './ClusterStatus.component';
import TileLine from './TileLine.component';
import AdmissionPlugins from './AdmissionPlugins.component';
import { isProcessing } from './ClusterManagement.component';

export type ClusterInformationProps = {
  kubeDetail: TKube;
};

export default function ClusterInformation({
  kubeDetail,
}: Readonly<ClusterInformationProps>) {
  const { t } = useTranslation('service');
  const { t: tDetail } = useTranslation('listing');

  return (
    <OsdsTile
      className="flex-col w-full shadow-lg"
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
          value={<Clipboard aria-label="clipboard" value={kubeDetail.id} />}
        />

        <TileLine
          title={t('kube_service_name')}
          value={
            <OsdsText
              className="mb-4 break-words"
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
          title={t('kube_service_cluster_admission_plugins')}
          value={
            <AdmissionPlugins
              isProcessing={isProcessing(kubeDetail.status)}
              {...kubeDetail.customization.apiServer.admissionPlugins}
            />
          }
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
            <Clipboard aria-label="clipboard" value={kubeDetail.nodesUrl} />
          }
        />
      </div>
    </OsdsTile>
  );
}
