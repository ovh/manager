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

import ClusterEtcd from './ClusterETCD.component';
import {
  Clipboard,
  TileBlock as TileLine,
} from '@ovh-ux/manager-react-components';
import { TKube } from '@/types';
import ClusterStatus from './ClusterStatus.component';
import ClusterETCD from './ClusterETCD.component';

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

        <TileLine label={tDetail('kube_list_id')}>
          <Clipboard aria-label="clipboard" value={kubeDetail.id} />
        </TileLine>

        <TileLine label={t('kube_service_name')}>
          {' '}
          <OsdsText
            className="mb-4 break-words"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {kubeDetail.name}
          </OsdsText>
        </TileLine>
        <TileLine label={t('kube_service_cluster_etcd_quota')}>
          <ClusterEtcd />
        </TileLine>
        <TileLine label={t('kube_service_cluster_status')}>
          <ClusterStatus status={kubeDetail.status} />
        </TileLine>
        <TileLine label={t('kube_service_name')}>
          <OsdsText
            className="mb-4 break-words"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {kubeDetail.name}
          </OsdsText>
        </TileLine>

        <TileLine label={t('kube_service_cluster_status')}>
          <ClusterStatus status={kubeDetail.status} />
        </TileLine>
        <TileLine label={t('kube_service_cluster_version')}>
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {kubeDetail.version}
          </OsdsText>
        </TileLine>
        <TileLine label={t('kube_service_cluster_admission_plugins')}>
          <AdmissionPlugins
            plugins={kubeDetail.plugins}
            isProcessing={isProcessing(kubeDetail.status)}
          />
        </TileLine>
        <TileLine label={t('kube_service_cluster_region')}>
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {kubeDetail.region}
          </OsdsText>
        </TileLine>
        <TileLine label={t('kube_service_name')}>
          <OsdsText
            className="mb-4 break-words"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {kubeDetail.name}
          </OsdsText>
        </TileLine>
        <TileLine label={t('kube_service_cluster_etcd_quota')}>
          <ClusterETCD />
        </TileLine>
        <TileLine label={t('kube_service_cluster_nodes_url')}>
          <Clipboard aria-label="clipboard" value={kubeDetail.nodesUrl} />
        </TileLine>
      </div>
    </OsdsTile>
  );
}
