import { useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsModal, OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useOidcProvider, useRemoveOidcProvider } from '@/api/hooks/useKubernetes';
import { KUBE_TRACK_PREFIX } from '@/tracking.constants';

export default function RemoveOIDCProvider() {
  const { t } = useTranslation('oidc-provider');
  const { projectId, kubeId } = useParams();
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const { tracking } = useContext(ShellContext)?.shell || {};

  const { addError, addSuccess } = useNotifications();

  const { data: oidcProvider, isPending: isPendingOidsProvider } = useOidcProvider(
    projectId,
    kubeId,
  );

  const { removeOidcProvider, isPending: isPendingRemoveOidcProvider } = useRemoveOidcProvider({
    projectId,
    kubeId,
    onError(error: ApiError) {
      addError(
        t(`pci_projects_project_kubernetes_details_service_remove_oidc_provider_request_error`, {
          message: error?.response?.data?.message || error?.message || null,
        }),
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        t(`pci_projects_project_kubernetes_details_service_remove_oidc_provider_request_success`),
        true,
      );
      onClose();
    },
  });

  const isPending = isPendingOidsProvider || isPendingRemoveOidcProvider;

  return (
    <OsdsModal
      headline={t('pci_projects_project_kubernetes_details_service_remove_oidc_provider_title')}
      onOdsModalClose={() => {
        tracking?.trackClick({
          name: `${KUBE_TRACK_PREFIX}::details::service::remove-oidc-provider::cancel`,
        });
        onClose();
      }}
      color={ODS_THEME_COLOR_INTENT.warning}
    >
      <slot name="content">
        {isPending ? (
          <div className="mt-6">
            <OsdsSpinner
              inline
              size={ODS_SPINNER_SIZE.md}
              className="block text-center"
              data-testid="addOIDCProvider-spinner"
            />
          </div>
        ) : (
          <div className="mt-6">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
            >
              {t(
                'pci_projects_project_kubernetes_details_service_remove_oidc_provider_description',
                { clientId: oidcProvider.clientId },
              )}
            </OsdsText>
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::remove-oidc-provider::cancel`,
          });
          onClose();
        }}
        data-testid="removeOIDCProvider-button_cancel"
      >
        {t('pci_projects_project_kubernetes_details_service_remove_oidc_provider_action_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isPending || undefined}
        data-testid="removeOIDCProvider-button_submit"
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::remove-oidc-provider::confirm`,
          });
          removeOidcProvider();
        }}
      >
        {t('pci_projects_project_kubernetes_details_service_remove_oidc_provider_action_remove')}
      </OsdsButton>
    </OsdsModal>
  );
}
