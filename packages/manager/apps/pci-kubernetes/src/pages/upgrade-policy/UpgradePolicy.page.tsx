import { useContext, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Translation, useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_RADIO_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_SIZE,
  OdsRadioGroupValueChangeEventDetail,
  OsdsRadioGroupCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useKubernetesCluster, useUpdateKubePolicy } from '@/api/hooks/useKubernetes';
import { UPGRADE_POLICIES } from '@/constants';
import { KUBE_TRACK_PREFIX } from '@/tracking.constants';

export default function UpgradePolicyPage() {
  const { t } = useTranslation('service');
  const { projectId, kubeId } = useParams();
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const [updatePolicy, setUpdatePolicy] = useState('');
  const { addError, addSuccess } = useNotifications();
  const { tracking } = useContext(ShellContext)?.shell || {};

  const { data: kubernetesCluster, isPending: isPendingCluster } = useKubernetesCluster(
    projectId,
    kubeId,
  );

  const { updateKubePolicy, isPending: isPendingUpdatePolicy } = useUpdateKubePolicy({
    projectId,
    kubeId,
    updatePolicy,
    onError(error: ApiError) {
      addError(
        <Translation ns="service">
          {(_t) =>
            _t('kube_service_upgrade_policy_error', {
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
        <Translation ns="service">{(_t) => _t('kube_service_upgrade_policy_success')}</Translation>,
        true,
      );
      onClose();
    },
  });

  useEffect(() => {
    if (kubernetesCluster) {
      setUpdatePolicy(kubernetesCluster.updatePolicy);
    }
  }, [kubernetesCluster]);

  const isPending = isPendingCluster || isPendingUpdatePolicy;

  return (
    <OsdsModal
      onOdsModalClose={() => {
        tracking?.trackClick({
          name: `${KUBE_TRACK_PREFIX}::details::service::upgradePolicy::cancel`,
        });
        onClose();
      }}
      headline={t('kube_service_upgrade_policy_model_title')}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="updatePolicy-spinner"
          />
        ) : (
          <OsdsRadioGroup
            value={updatePolicy}
            onOdsValueChange={(
              event: OsdsRadioGroupCustomEvent<OdsRadioGroupValueChangeEventDetail>,
            ) => {
              setUpdatePolicy(event.detail.newValue);
            }}
          >
            {UPGRADE_POLICIES.map((policy) => (
              <OsdsRadio key={policy} className="mt-8" value={policy}>
                <OsdsRadioButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_RADIO_BUTTON_SIZE.xs}
                >
                  <div slot="end" className="inline-block">
                    <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_TEXT_SIZE._600}>
                      {t(`kube_service_upgrade_policy_${policy}`)}
                    </OsdsText>
                    <OsdsText
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_TEXT_SIZE._400}
                      className="mt-2 block"
                    >
                      {t(`kube_service_upgrade_policy_description_${policy}`)}
                    </OsdsText>
                  </div>
                </OsdsRadioButton>
              </OsdsRadio>
            ))}
          </OsdsRadioGroup>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::upgradePolicy::cancel`,
          });
          onClose();
        }}
        data-testid="upgradePolicy-button_cancel"
      >
        {t('kube_service_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isPending || undefined}
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::upgradePolicy::confirm`,
          });
          updateKubePolicy();
        }}
        data-testid="upgradePolicy-button_submit"
      >
        {t('kube_service_common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
