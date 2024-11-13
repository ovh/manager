import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
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
import { useContext, useEffect, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useOidcProvider,
  useAddOrUpdateOidcProvider,
} from '@/api/hooks/useKubernetes';
import { KUBE_TRACK_PREFIX } from '@/tracking.constants';

const oidcSchema = z.object({
  issuerUrl: z
    .string()
    .url({ message: 'Issuer URL must be a valid URL' })
    .refine((url) => url.startsWith('https://'), {
      message: 'Issuer URL must use HTTPS protocol',
    }),
  clientId: z
    .string()
    .min(1, { message: 'common:common_field_error_required' }),
  usernameClaim: z.string().optional(),
  usernamePrefix: z.string().optional(),
  groupsClaim: z
    .string()
    .nullable()
    .optional(),
  groupsPrefix: z.string().optional(),
  signingAlgorithms: z
    .string()
    .nullable()
    .optional(),
  caContent: z.string().optional(),
  requiredClaim: z
    .string()
    .nullable()
    .optional(),
});

export type OidcFormValues = z.infer<typeof oidcSchema> &
  Required<{ issuerUrl: string; clientId: string }>;

export default function AddOrUpdateOIDCProvider() {
  const { t } = useTranslation([
    'add-oidc-provider',
    'update-oidc-provider',
    'common',
  ]);
  const { projectId, kubeId } = useParams();
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const { tracking } = useContext(ShellContext)?.shell || {};
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm<OidcFormValues>({
    resolver: zodResolver(oidcSchema),
    defaultValues: {
      issuerUrl: '',
      clientId: '',
    },
  });

  const { addError, addSuccess } = useNotifications();

  const {
    data: oidcProvider,
    isPending: isPendingOidcProvider,
  } = useOidcProvider(projectId, kubeId);

  useEffect(() => {
    if (oidcProvider) {
      setValue('issuerUrl', oidcProvider.issuerUrl);
      setValue('clientId', oidcProvider.clientId);
      setIsUpdate(!!oidcProvider?.clientId);
    }
  }, [oidcProvider]);

  const {
    addOrUpdateOidcProvider,
    isPending: isPendingAddOrUpdateOidcProvider,
  } = useAddOrUpdateOidcProvider({
    projectId,
    kubeId,
    isUpdate,
    onError(error: ApiError) {
      addError(
        <Translation
          ns={`${isUpdate ? 'update-oidc-provider' : 'add-oidc-provider'}`}
        >
          {(_t) =>
            _t(
              `pci_projects_project_kubernetes_details_service_${
                isUpdate ? 'update' : 'add'
              }_oidc_provider_request_error`,
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
        <Translation
          ns={`${isUpdate ? 'update-oidc-provider' : 'add-oidc-provider'}`}
        >
          {(_t) =>
            _t(
              `pci_projects_project_kubernetes_details_service_${
                isUpdate ? 'update' : 'add'
              }_oidc_provider_request_success`,
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });
  const isPending = isPendingOidcProvider || isPendingAddOrUpdateOidcProvider;
  const onSubmit = (data: OidcFormValues) => {
    addOrUpdateOidcProvider(data);
  };
  return (
    <OsdsModal
      onOdsModalClose={() => {
        tracking?.trackClick({
          name: `${KUBE_TRACK_PREFIX}::details::service::${
            isUpdate ? 'update' : 'add'
          }-oidc-provider::cancel`,
        });
        onClose();
      }}
      headline={t(
        `${
          isUpdate ? 'update-oidc-provider:' : 'add-oidc-provider:'
        }pci_projects_project_kubernetes_details_service_${
          isUpdate ? 'update' : 'add'
        }_oidc_provider_title`,
      )}
    >
      <slot name="content">
        {isPending ? (
          <div className="mt-6">
            <OsdsSpinner
              inline
              size={ODS_SPINNER_SIZE.md}
              className="block text-center"
              data-testid={`${isUpdate ? 'update' : 'add'}OIDCProvider-spinner`}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <OsdsText
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(
                'pci_projects_project_kubernetes_details_service_add_oidc_provider_description',
              )}
            </OsdsText>
            <OsdsFormField
              class="mt-6"
              data-testid="issuerUrl-formfield"
              error={t(errors.issuerUrl?.message) || ''}
            >
              <OsdsText
                size={ODS_TEXT_SIZE._200}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="label"
              >
                {t(
                  `${
                    isUpdate ? 'update-oidc-provider:' : 'add-oidc-provider:'
                  }pci_projects_project_kubernetes_details_service_${
                    isUpdate ? 'update' : 'add'
                  }_oidc_provider_field_url`,
                )}
              </OsdsText>

              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_TEXT_COLOR_INTENT.text}
              >
                {t(
                  'pci_projects_project_kubernetes_details_service_add_oidc_provider_field_url_extra',
                )}
              </OsdsText>
              <Controller
                name="issuerUrl"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <OsdsInput
                    type={ODS_INPUT_TYPE.text}
                    className={`mt-3 ${errors.issuerUrl ? 'bg-red-100' : ''}`}
                    data-testid="issuerUrl-input"
                    onOdsInputBlur={onBlur}
                    value={value}
                    onOdsValueChange={onChange}
                  />
                )}
              />
            </OsdsFormField>
            <OsdsFormField
              class="mt-10"
              data-testid="clientId-formfield"
              error={t(errors.clientId?.message) || ''}
            >
              <OsdsText
                size={ODS_TEXT_SIZE._200}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="label"
              >
                {t(
                  `${
                    isUpdate ? 'update-oidc-provider:' : 'add-oidc-provider:'
                  }pci_projects_project_kubernetes_details_service_${
                    isUpdate ? 'update' : 'add'
                  }_oidc_provider_field_client_id`,
                )}
              </OsdsText>
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_TEXT_COLOR_INTENT.text}
              >
                {t(
                  'pci_projects_project_kubernetes_details_service_add_oidc_provider_field_client_id_extra',
                )}
              </OsdsText>
              <Controller
                name="clientId"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <OsdsInput
                    type={ODS_INPUT_TYPE.text}
                    className={`mt-3 ${errors.clientId ? 'bg-red-100' : ''}`}
                    data-testid="clientId-input"
                    onOdsInputBlur={onBlur}
                    value={value}
                    onOdsValueChange={onChange}
                  />
                )}
              />
            </OsdsFormField>
            <div className="mt-6 flex justify-end gap-4">
              <OsdsButton
                color={ODS_THEME_COLOR_INTENT.primary}
                variant={ODS_BUTTON_VARIANT.ghost}
                onClick={onClose}
                data-testid={`${
                  isUpdate ? 'update-oidc-provider:' : 'add-oidc-provider:'
                }${isUpdate ? 'update' : 'add'}OIDCProvider-button_cancel`}
              >
                {t(
                  `${
                    isUpdate ? 'update-oidc-provider:' : 'add-oidc-provider:'
                  }pci_projects_project_kubernetes_details_service_${
                    isUpdate ? 'update' : 'add'
                  }_oidc_provider_action_cancel`,
                )}
              </OsdsButton>
              <OsdsButton
                color={ODS_THEME_COLOR_INTENT.primary}
                disabled={isPending || isSubmitting || undefined}
                type={ODS_BUTTON_TYPE.submit}
                data-testid={`${
                  isUpdate ? 'update' : 'add'
                }OIDCProvider-button_submit`}
              >
                {t(
                  `${
                    isUpdate ? 'update-oidc-provider:' : 'add-oidc-provider:'
                  }pci_projects_project_kubernetes_details_service_${
                    isUpdate ? 'update' : 'add'
                  }_oidc_provider_action_${isUpdate ? 'update' : 'add'}`,
                )}
              </OsdsButton>
            </div>
          </form>
        )}
      </slot>
    </OsdsModal>
  );
}
