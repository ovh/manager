import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsMessage,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useContext, useEffect, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  useKubernetesCluster,
  useTerminateCluster,
} from '@/api/hooks/useKubernetes';
import { KUBE_TRACK_PREFIX } from '@/tracking.constants';

export default function TerminatePage() {
  const { projectId, kubeId } = useParams();
  const { t } = useTranslation('terminate');
  const { t: tCommon } = useTranslation('common');
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const {
    data: kubernetesCluster,
    isPending: isPendingCluster,
  } = useKubernetesCluster(projectId, kubeId);
  const [formState, setFormState] = useState({
    terminateInput: '',
    hasError: false,
    isTouched: false,
  });

  const { tracking } = useContext(ShellContext)?.shell || {};

  const {
    terminateCluster,
    isPending: isPendingTerminate,
  } = useTerminateCluster({
    projectId,
    kubeId,
    onError(error: ApiError) {
      addError(
        <Translation ns="terminate">
          {(_t) =>
            _t('kube_service_terminate_error', {
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
        <Translation ns="terminate">
          {(_t) => _t('kube_service_terminate_success')}
        </Translation>,
        true,
      );
      onClose();
    },
  });

  useEffect(() => {
    setFormState({
      ...formState,
      hasError: formState.isTouched && formState.terminateInput !== 'TERMINATE',
    });
  }, [formState.terminateInput, formState.isTouched]);

  const handleInputDeleteChange = (event: OdsInputValueChangeEvent) => {
    setFormState({
      ...formState,
      terminateInput: event.detail.value,
      isTouched: true,
    });
  };

  const isPending = isPendingCluster || isPendingTerminate;
  return (
    <OsdsModal
      onOdsModalClose={() => {
        tracking?.trackClick({
          name: `${KUBE_TRACK_PREFIX}::details::service::terminate::cancel`,
        });
        onClose();
      }}
      color={ODS_THEME_COLOR_INTENT.warning}
      headline={t('kube_service_terminate_title')}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="terminate-spinner"
          />
        ) : (
          <div className="mt-6">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="break-words"
            >
              {t('kube_service_terminate_description', {
                clusterName: kubernetesCluster?.name,
              })}
            </OsdsText>
            <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="mt-6">
              {t('kube_service_terminate_warning')}
            </OsdsMessage>
            <OsdsFormField
              class="mt-6"
              data-testid="terminate-formfield"
              error={
                formState.hasError ? tCommon('common_field_error_required') : ''
              }
            >
              <OsdsText
                slot="label"
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._200}
              >
                {t('kube_service_terminate_enter')}
              </OsdsText>
              <OsdsInput
                value={formState.terminateInput}
                type={ODS_INPUT_TYPE.text}
                data-testid="terminate-input"
                onOdsValueChange={handleInputDeleteChange}
                className={
                  formState.hasError
                    ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                    : 'border-color-[var(--ods-color-default-200)] bg-white'
                }
                onOdsInputBlur={() => {
                  setFormState({
                    ...formState,
                    isTouched: true,
                  });
                }}
              />
            </OsdsFormField>
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::terminate::cancel`,
          });
          onClose();
        }}
        data-testid="terminate-button_cancel"
      >
        {t('kube_service_terminate_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::terminate::confirm`,
          });
          terminateCluster();
        }}
        disabled={
          isPending || formState.terminateInput !== 'TERMINATE' || undefined
        }
        data-testid="terminate-button_submit"
      >
        {t('kube_service_terminate_common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
