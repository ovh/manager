import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_DIVIDER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { TKube } from '@/types';
import { PROCESSING_STATUS, STATUS } from '@/constants';
import { useGetCloudSchema } from '@/api/hooks/useCloud';
import TileButton from './TileButton.component';

export type ClusterManagementProps = {
  kubeDetail: TKube;
};

export const isProcessing = (status: string) =>
  PROCESSING_STATUS.includes(status);

export default function ClusterManagement({
  kubeDetail,
}: Readonly<ClusterManagementProps>) {
  const { t } = useTranslation('service');
  const { t: tDetail } = useTranslation('listing');

  const hrefRenameCluster = useHref('./name');
  const hrefResetClusterConfig = useHref('./reset-kubeconfig');
  const hrefResetCluster = useHref('./reset');
  const hrefCreateNodePool = useHref('../nodepools/new');
  const hrefTerminateCluster = useHref('./terminate');
  const hrefUpgradePolicy = useHref('./upgrade-policy');
  const hrefMinorUpdate = useHref('./update');
  const hrefForceUpdate = useHref('./update?forceVersion');

  const { data: cloudSchema } = useGetCloudSchema();

  const clusterMinorVersion = useMemo<string>(() => {
    const [majorVersion, minorVersion] = kubeDetail?.version
      ? kubeDetail.version.split('.')
      : [];
    return `${majorVersion}.${minorVersion}`;
  }, [kubeDetail]);

  const highestVersion = useMemo<number>(() => {
    if (!cloudSchema) return 0;

    const kubeVersions = cloudSchema.models['cloud.kube.VersionEnum'].enum;
    if (!kubeVersions || kubeVersions.length === 0) return 0;

    return kubeVersions
      .map((version) => parseFloat(version))
      .reduce((max, current) => (current > max ? current : max), 0);
  }, [cloudSchema]);

  return (
    <OsdsTile
      className="flex-col w-full shadow-lg"
      rounded
      variant={ODS_TILE_VARIANT.ghost}
    >
      <div className="flex flex-col w-full">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
          className="mb-5"
        >
          {t('kube_service_manage_title')}
        </OsdsText>
        <OsdsDivider separator size={ODS_DIVIDER_SIZE.zero} />

        <TileButton
          title={t('kube_service_common_edit')}
          isDisabled={isProcessing(kubeDetail?.status)}
          href={hrefRenameCluster}
          dataTestId="clusterManagement-edit"
        />
        <TileButton
          title={t('kube_service_reset')}
          isDisabled={isProcessing(kubeDetail?.status)}
          href={hrefResetCluster}
        />
        <TileButton
          title={tDetail('kube_common_create_node_pool')}
          isDisabled={isProcessing(kubeDetail?.status)}
          href={hrefCreateNodePool}
        />
        <TileButton
          title={t('kube_service_reset_kubeconfig')}
          isDisabled={isProcessing(kubeDetail?.status)}
          href={hrefResetClusterConfig}
        />
        <TileButton
          title={t('kube_service_common_edit_security_update_policy')}
          isDisabled={isProcessing(kubeDetail?.status)}
          href={hrefUpgradePolicy}
        />
        {!kubeDetail.isUpToDate && (
          <TileButton
            title={t('kube_service_common_update')}
            isDisabled={kubeDetail?.status !== STATUS.READY}
            href={hrefForceUpdate}
          />
        )}

        {parseFloat(clusterMinorVersion) !== highestVersion && (
          <TileButton
            title={t('kube_service_minor_version_upgrade')}
            isDisabled={isProcessing(kubeDetail?.status)}
            href={hrefMinorUpdate}
          />
        )}

        <TileButton
          title={t('kube_service_terminate')}
          isDisabled={isProcessing(kubeDetail?.status)}
          href={hrefTerminateCluster}
          dataTestId="clusterManagement-terminate"
        />
      </div>
    </OsdsTile>
  );
}
