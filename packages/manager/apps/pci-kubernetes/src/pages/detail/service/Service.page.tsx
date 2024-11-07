import { Notifications, useMe } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { useGetCloudSchema } from '@/api/hooks/useCloud';
import { useKubeDetail } from '@/api/hooks/useKubernetes';
import ClusterAccessAndSecurity from '@/components/service/ClusterAccessAndSecurity.component';
import ClusterInformation from '@/components/service/ClusterInformation.component';
import ClusterManagement from '@/components/service/ClusterManagement.component';
import ClusterSecurityUpgradeBanner from '@/components/service/ClusterSecurityUpgradeBanner.component';
import ClusterVersionUpgradeBanner from '@/components/service/ClusterVersionUpgradeBanner.component';
import ClusterNetwork from '@/components/service/ClusterNetwork.component';
import {
  KUBE_INSTALL_URL,
  KUBECTL_URL,
  PROCESSING_STATUS,
  STATUS,
} from '@/constants';

export default function ServicePage() {
  const { t } = useTranslation('service');
  const { projectId, kubeId } = useParams();

  const { data: kubeDetail, isPending } = useKubeDetail(projectId, kubeId);
  const { data: cloudSchema } = useGetCloudSchema();
  const ovhSubsidiary = useMe()?.me?.ovhSubsidiary;

  const isVersionSupported = useMemo<boolean>(() => {
    if (kubeDetail?.version && cloudSchema) {
      const [majorVersion, minorVersion] = kubeDetail.version.split('.');
      const clusterMinorVersion = `${majorVersion}.${minorVersion}`;
      const kubeVersions = cloudSchema?.models['cloud.kube.VersionEnum'].enum;
      return kubeVersions.includes(clusterMinorVersion);
    }
    return true;
  }, [cloudSchema, kubeDetail]);

  const isProcessing = (status: string) => PROCESSING_STATUS.includes(status);

  return (
    <>
      {isPending ? (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <div>
          <div className="my-5 flex flex-col gap-5">
            <Notifications />

            {!isVersionSupported && <ClusterVersionUpgradeBanner />}

            {!kubeDetail?.isUpToDate &&
              kubeDetail?.status !== STATUS.UPDATING && (
                <ClusterSecurityUpgradeBanner
                  isDisabled={isProcessing(kubeDetail?.status) || undefined}
                />
              )}
          </div>

          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            className="block mb-5"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: t('kube_service_description_information', {
                  url: KUBECTL_URL,
                }),
              }}
            />
          </OsdsText>
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            className="block mb-5"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: t('kube_service_installation_information', {
                  url:
                    KUBE_INSTALL_URL[ovhSubsidiary] || KUBE_INSTALL_URL.DEFAULT,
                }),
              }}
            />
          </OsdsText>
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            className="block mb-5"
          >
            {t('kube_service_description_reset')}
          </OsdsText>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            <div className="grid gap-7">
              <ClusterManagement kubeDetail={kubeDetail} />
              <ClusterNetwork projectId={projectId} kubeDetail={kubeDetail} />
            </div>
            <div className="grid gap-7">
              <ClusterInformation kubeDetail={kubeDetail} />
            </div>
            <div className="grid gap-7">
              <ClusterAccessAndSecurity kubeDetail={kubeDetail} />
            </div>
          </div>

          <Outlet />
        </div>
      )}
    </>
  );
}
