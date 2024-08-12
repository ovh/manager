import { Notifications } from '@ovhcloud/manager-components';
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
import { KUBE_INSTALL_URL, KUBECTL_URL, STATUS } from '@/constants';

export default function ServicePage() {
  const { t } = useTranslation('service');
  const { projectId, kubeId } = useParams();

  const { data: kubeDetail, isPending } = useKubeDetail(projectId, kubeId);
  const { data: cloudSchema } = useGetCloudSchema();

  const isVersionSupported = useMemo<boolean>(() => {
    if (kubeDetail?.version && cloudSchema) {
      const [majorVersion, minorVersion] = kubeDetail.version.split('.');
      const clusterMinorVersion = `${majorVersion}.${minorVersion}`;
      const kubeVersions = cloudSchema?.models['cloud.kube.VersionEnum'].enum;
      return kubeVersions.includes(clusterMinorVersion);
    }
    return false;
  }, [cloudSchema, kubeDetail]);

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
                <ClusterSecurityUpgradeBanner />
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
                  url: KUBE_INSTALL_URL,
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

          <div className="flex flex-row flex-wrap md:flex-nowrap gap-10 my-5">
            <ClusterManagement kubeDetail={kubeDetail} />
            <ClusterInformation kubeDetail={kubeDetail} />
            <ClusterAccessAndSecurity kubeDetail={kubeDetail} />
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}
