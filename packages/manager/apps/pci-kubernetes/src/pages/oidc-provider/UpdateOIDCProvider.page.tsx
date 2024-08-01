import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNotifications } from '@ovhcloud/manager-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useOidcProvider,
  useUpdateOidcProvider,
} from '@/api/hooks/useKubernetes';
import { TOidcProvider } from '@/api/data/kubernetes';

export default function UpdateOIDCProvider() {
  const { t } = useTranslation('update-oidc-provider');
  const { t: tCommon } = useTranslation('common');
  const { projectId, kubeId } = useParams();
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const [formState, setFormState] = useState({
    issuerUrl: '',
    issuerUrlTouched: false,
    clientId: '',
    clientIdTouched: false,
  });
  const { addError, addSuccess } = useNotifications();
  const {
    data: oidcProvider,
    isPending: isPendingOidsProvider,
  } = useOidcProvider(projectId, kubeId);
  useEffect(() => {
    if (oidcProvider) {
      setFormState((state) => ({
        ...state,
        issuerUrl: oidcProvider.issuerUrl,
        clientId: oidcProvider.clientId,
      }));
    }
  }, [oidcProvider]);
  const {
    updateOidcProvider,
    isPending: isPendingUpdateOidcProvider,
  } = useUpdateOidcProvider({
    projectId,
    kubeId,
    params: {
      issuerUrl: formState.issuerUrl,
      clientId: formState.clientId,
    } as TOidcProvider,
    onError(error: ApiError) {
      addError(
        <Translation ns="update-oidc-provider">
          {(_t) =>
            _t(
              'pci_projects_project_kubernetes_details_service_update_oidc_provider_request_error',
              {
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="update-oidc-provider">
          {(_t) =>
            _t(
              'pci_projects_project_kubernetes_details_service_update_oidc_provider_request_success',
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });
  const canSubmit = formState.issuerUrl && formState.clientId;
  const hasClientIdError = formState.clientIdTouched && !formState.clientId;
  const hasIssuerUrlError = formState.issuerUrlTouched && !formState.issuerUrl;
  const isPending = isPendingOidsProvider || isPendingUpdateOidcProvider;
  return (
    <OsdsModal
      onOdsModalClose={onClose}
      headline={t(
        'pci_projects_project_kubernetes_details_service_update_oidc_provider_title',
      )}
    >
      <slot name="content">
        {isPending ? (
          <div className="mt-6">
            <OsdsSpinner
              inline
              size={ODS_SPINNER_SIZE.md}
              className="block text-center"
              data-testid="updateOIDCProvider-spinner"
            />
          </div>
        ) : (
          <div className="mt-6">
            <OsdsText
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(
                'pci_projects_project_kubernetes_details_service_update_oidc_provider_description',
              )}
            </OsdsText>
            <OsdsFormField
              class="mt-6"
              data-testid="issuerUrl-formfield"
              error={
                hasIssuerUrlError ? tCommon('common_field_error_required') : ''
              }
            >
              <OsdsText
                size={ODS_TEXT_SIZE._200}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="label"
              >
                {t(
                  'pci_projects_project_kubernetes_details_service_update_oidc_provider_field_url',
                )}
              </OsdsText>
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_TEXT_COLOR_INTENT.text}
              >
                {t(
                  'pci_projects_project_kubernetes_details_service_update_oidc_provider_field_url_extra',
                )}
              </OsdsText>
              <OsdsInput
                type={ODS_INPUT_TYPE.text}
                error={hasIssuerUrlError || undefined}
                className={`mt-3 ${hasIssuerUrlError ? 'bg-red-100' : ''}`}
                data-testid="issuerUrl-input"
                onOdsInputBlur={() => {
                  setFormState((state) => ({
                    ...state,
                    issuerUrlTouched: true,
                  }));
                }}
                value={formState.issuerUrl}
                onOdsValueChange={(event) => {
                  setFormState((state) => ({
                    ...state,
                    issuerUrl: event.target.value.toString(),
                  }));
                }}
              />
            </OsdsFormField>
            <OsdsFormField
              class="mt-10"
              data-testid="clientId-formfield"
              error={
                hasClientIdError ? tCommon('common_field_error_required') : ''
              }
            >
              <OsdsText
                size={ODS_TEXT_SIZE._200}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="label"
              >
                {t(
                  'pci_projects_project_kubernetes_details_service_update_oidc_provider_field_client_id',
                )}
              </OsdsText>
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_TEXT_COLOR_INTENT.text}
              >
                {t(
                  'pci_projects_project_kubernetes_details_service_update_oidc_provider_field_client_id_extra',
                )}
              </OsdsText>
              <OsdsInput
                type={ODS_INPUT_TYPE.text}
                value={formState.clientId}
                data-testid="clientId-input"
                error={hasClientIdError || undefined}
                className={`mt-3 ${hasClientIdError ? 'bg-red-100' : ''}`}
                onOdsInputBlur={() => {
                  setFormState((state) => ({
                    ...state,
                    clientIdTouched: true,
                  }));
                }}
                onOdsValueChange={(event) => {
                  setFormState((state) => ({
                    ...state,
                    clientId: event.target.value.toString(),
                  }));
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
        onClick={onClose}
        data-testid="updateOIDCProvider-button_cancel"
      >
        {t(
          'pci_projects_project_kubernetes_details_service_update_oidc_provider_action_cancel',
        )}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        onClick={updateOidcProvider}
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isPending || !canSubmit || undefined}
        data-testid="updateOIDCProvider-button_submit"
      >
        {t(
          'pci_projects_project_kubernetes_details_service_update_oidc_provider_action_update',
        )}
      </OsdsButton>
    </OsdsModal>
  );
}
