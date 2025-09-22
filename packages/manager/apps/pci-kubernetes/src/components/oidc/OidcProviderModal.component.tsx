import { useCallback, useContext, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsAccordion,
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useOidcProvider, useUpsertOidcProvider } from '@/api/hooks/useKubernetes';
import { parseCommaSeparated, transformKey } from '@/helpers';
import useFormFields from '@/hooks/useFormField';
import { KUBE_TRACK_PREFIX } from '@/tracking.constants';
import { PlaceHolder, SigningAlgorithms, TOidcFormValues, oidcSchema } from '@/types';

import { OptionalFormField } from './OptionalFormField.component';
import RenderFormField from './RenderFormField.component';

export function OidcProviderModal() {
  const { t } = useTranslation(['oidc-provider', 'common']);
  const [isOptional, setIsOptional] = useState<boolean>(false);
  const { projectId, kubeId } = useParams();
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const { tracking } = useContext(ShellContext)?.shell || {};

  const methods = useForm<TOidcFormValues>({
    resolver: zodResolver(oidcSchema),
    defaultValues: {
      issuerUrl: '',
      clientId: '',
      usernameClaim: '',
      usernamePrefix: '',
      caContent: '',
      signingAlgorithms: [SigningAlgorithms.RS256],
      requiredClaim: '',
      groupsClaim: '',
      groupsPrefix: '',
    },
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = methods;
  const { addError, addSuccess } = useNotifications();

  const { data: oidcProvider, isPending: isPendingOidcProvider } = useOidcProvider(
    projectId,
    kubeId,
  );

  useEffect(() => {
    if (oidcProvider) {
      reset({
        issuerUrl: oidcProvider.issuerUrl,
        clientId: oidcProvider.clientId,
        usernameClaim: oidcProvider?.usernameClaim,
        usernamePrefix: oidcProvider?.usernamePrefix,
        caContent: oidcProvider?.caContent,
        groupsClaim: oidcProvider?.groupsClaim?.join(','),
        groupsPrefix: oidcProvider?.groupsPrefix,
        signingAlgorithms: oidcProvider?.signingAlgorithms ?? [],
        requiredClaim: oidcProvider?.requiredClaim?.join(','),
      });
    }
  }, [oidcProvider, reset]);

  const isUpdate = !!oidcProvider?.clientId;
  const mode = isUpdate ? 'update' : 'add';

  const { upsertOidcProvider, isPending: isPendingUpsertOidcProvider } = useUpsertOidcProvider({
    projectId,
    kubeId,
    isUpdate,
    onError(error: ApiError) {
      addError(
        t(`pci_projects_project_kubernetes_details_service_${mode}_oidc_provider_request_error`, {
          message: error?.response?.data?.message || error?.message || null,
        }),
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        t(`pci_projects_project_kubernetes_details_service_${mode}_oidc_provider_request_success`),
        true,
      );
      onClose();
    },
  });

  const isPending = isPendingOidcProvider || isPendingUpsertOidcProvider;
  const fields = useFormFields();

  const onSubmit = useCallback(
    (data: TOidcFormValues) => {
      const formattedData = {
        ...data,
        groupsClaim: parseCommaSeparated(data?.groupsClaim),
        requiredClaim: parseCommaSeparated(data?.requiredClaim),
        signingAlgorithms: data?.signingAlgorithms || [],
      };
      upsertOidcProvider(formattedData);
    },
    [upsertOidcProvider],
  );

  return (
    <OsdsModal
      onOdsModalClose={() => {
        tracking?.trackClick({
          name: `${KUBE_TRACK_PREFIX}::details::service:::cancel`,
        });
        onClose();
      }}
      headline={t(`pci_projects_project_kubernetes_details_service_${mode}_oidc_provider_title`)}
    >
      <slot name="content">
        {isPending ? (
          <div className="mt-6">
            <OsdsSpinner
              inline
              size={ODS_SPINNER_SIZE.md}
              className="block text-center"
              data-testid={`${mode}OIDCProvider-spinner`}
            />
          </div>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t(
                  'pci_projects_project_kubernetes_details_service_upsert_oidc_provider_description',
                )}
              </OsdsText>

              {['issuerUrl', 'clientId'].map((fieldName) => {
                const transformedFieldName = transformKey(fieldName);
                return (
                  <RenderFormField
                    key={fieldName}
                    name={fieldName as keyof TOidcFormValues}
                    label={t(
                      `pci_projects_project_kubernetes_details_service_${mode}_oidc_provider_field_${transformedFieldName}`,
                    )}
                    description={t(
                      `pci_projects_project_kubernetes_details_service_${mode}_oidc_provider_field_${transformedFieldName}_extra`,
                    )}
                    error={t(errors[fieldName]?.message)}
                    control={control}
                    placeholder={PlaceHolder[fieldName]}
                  />
                );
              })}
              <div className="mt-8">
                <OsdsAccordion onOdsAccordionToggle={() => setIsOptional(!isOptional)}>
                  <span slot="summary">
                    {isOptional
                      ? t('pci_projects_project_kubernetes_details_service_hide_optional')
                      : t('pci_projects_project_kubernetes_details_service_show_optional')}
                  </span>
                  {fields?.map(({ name, label, description, component, placeholder, caption }) => (
                    <OptionalFormField
                      key={name}
                      name={name}
                      label={label}
                      description={description}
                      component={component}
                      placeholder={placeholder}
                      caption={caption}
                    />
                  ))}
                </OsdsAccordion>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <OsdsButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.ghost}
                  onClick={onClose}
                  data-testid={`${mode}OIDCProvider-button_cancel`}
                >
                  {t(
                    `pci_projects_project_kubernetes_details_service_${mode}_oidc_provider_action_cancel`,
                  )}
                </OsdsButton>
                <OsdsButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  disabled={isPending || isSubmitting || undefined}
                  type={ODS_BUTTON_TYPE.submit}
                  data-testid={`${mode}OIDCProvider-button_submit`}
                >
                  {t(
                    `pci_projects_project_kubernetes_details_service_${mode}_oidc_provider_action_${mode}`,
                  )}
                </OsdsButton>
              </div>
            </form>
          </FormProvider>
        )}
      </slot>
    </OsdsModal>
  );
}
