import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useNotifications } from '@ovhcloud/manager-components';
import { useEffect, useState } from 'react';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useKubernetesCluster,
  useUpdateKubeVersion,
} from '@/api/hooks/useKubernetes';
import UpdateVersionContent from '@/components/UpdateVersionContent';
import { UPDATE_STRATEGY } from '@/constants';

export default function UpdateVersionPage() {
  const { t } = useTranslation('update');
  const { projectId, kubeId } = useParams();
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const { addError, addSuccess } = useNotifications();
  const [nextMinorVersion, setNextMinorVersion] = useState('');
  const [clusterMinorVersion, setClusterMinorVersion] = useState('');
  const [searchParams] = useSearchParams();

  const forceVersion =
    searchParams.get('forceVersion') === 'true' ||
    searchParams.get('forceVersion') === '';

  const strategy = forceVersion ? UPDATE_STRATEGY.PATCH : UPDATE_STRATEGY.MINOR;

  const {
    data: kubernetesCluster,
    isPending: isPendingCluster,
  } = useKubernetesCluster(projectId, kubeId);

  const {
    updateKubeVersion,
    isPending: isPendingUpdateVersion,
  } = useUpdateKubeVersion({
    projectId,
    kubeId,
    strategy,
    onError(error: ApiError) {
      addError(
        <Translation ns="update">
          {(_t) =>
            _t('kube_service_update_error', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="update">
          {(_t) => _t('kube_service_update_success')}
        </Translation>,
        true,
      );
      onClose();
    },
  });

  useEffect(() => {
    if (kubernetesCluster) {
      const [majorVersion, minorVersion] = kubernetesCluster.version.split('.');
      setNextMinorVersion(`${majorVersion}.${parseInt(minorVersion, 10) + 1}`);
      setClusterMinorVersion(`${majorVersion}.${minorVersion}`);
    }
  }, [kubernetesCluster]);
  const isPending = isPendingCluster || isPendingUpdateVersion;

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.warning}
      onOdsModalClose={onClose}
      headline={
        forceVersion
          ? t('kube_service_update_title')
          : t('kube_service__minor_version_update_title')
      }
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="updateVersion-spinner"
          />
        ) : (
          <UpdateVersionContent
            forceVersion={forceVersion}
            clusterMinorVersion={clusterMinorVersion}
            nextMinorVersion={nextMinorVersion}
          />
        )}
      </slot>

      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
        data-testid="updateVersion-button_cancel"
      >
        {t('kube_service_update_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isPending || undefined}
        onClick={updateKubeVersion}
        data-testid="updateVersion-button_submit"
      >
        {t('kube_service_update_common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
