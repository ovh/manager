import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  SecretCasRequiredFormField,
  formValueToCasRequired,
} from '@secret-manager/components/form/SecretCasRequiredFormField.component';
import { SecretDeactivateVersionAfterFormField } from '@secret-manager/components/form/SecretDeactivateVersionAfterFormField.component';
import { SecretMaxVersionsFormField } from '@secret-manager/components/form/SecretMaxVersionsFormField.component';
import { SecretPathFormField } from '@secret-manager/components/form/SecretPathFormField.component';
import { KeyValuesEditor } from '@secret-manager/components/form/key-values-editor/KeyValuesEditor';
import { SecretDataFormField } from '@secret-manager/components/form/secret-data-form-field/SecretDataFormField.component';
import { secretQueryKeys } from '@secret-manager/data/api/secrets';
import { useCreateSecret } from '@secret-manager/data/hooks/useCreateSecret';
import { SECRET_FORM_TEST_IDS } from '@secret-manager/pages/create-secret/SecretForm.constants';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { SecretVersionDataField } from '@secret-manager/types/secret.type';
import { safeJsonParse } from '@secret-manager/utils/json';
import { useSecretDataSchema, useSecretPathSchema } from '@secret-manager/validation';
import { useCustomMetadataSchema } from '@secret-manager/validation/custom-metadata/customMetadataSchema';
import { useSecretConfigSchema } from '@secret-manager/validation/secret-config/secretConfigSchema';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Card, Message, Text, Toggle, ToggleControl, ToggleLabel } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, PageType } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';
import { Button } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { PATH_LABEL } from '@/constants';

import { SecretFormBackLink } from './BackLink.component';

type SecretFormProps = {
  okmsId?: string;
};

export const SecretForm = ({ okmsId }: SecretFormProps) => {
  const { t } = useTranslation([
    'secret-manager',
    NAMESPACES.ACTIONS,
    NAMESPACES.ERROR,
    NAMESPACES.STATUS,
  ]);
  const navigate = useNavigate();
  const { addError } = useNotifications();
  const queryClient = useQueryClient();
  const { trackClick, trackPage } = useOkmsTracking();

  /* Form */
  const pathSchema = useSecretPathSchema();
  const dataSchema = useSecretDataSchema();
  const metadataSchema = useSecretConfigSchema();
  const customMetadataSchema = useCustomMetadataSchema();

  const secretSchema = z.object({
    path: pathSchema,
    data: dataSchema,
    // Toggle flags
    enableCustomMetadata: z.boolean().default(false),
    enableDeactivateVersionAfter: z.boolean().default(false),
    enableMaxVersions: z.boolean().default(false),
    enableCasRequired: z.boolean().default(false),
    // Optional fields (no defaults - start empty when enabled)
    customMetadata: customMetadataSchema.optional(),
    deactivateVersionAfter: metadataSchema.shape.deactivateVersionAfter.optional(),
    maxVersions: metadataSchema.shape.maxVersions.optional(),
    casRequired: metadataSchema.shape.casRequired.optional(),
  });

  type SecretSchema = z.infer<typeof secretSchema>;

  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(secretSchema),
    defaultValues: {
      path: '',
      data: '',
      enableCustomMetadata: false,
      enableDeactivateVersionAfter: false,
      enableMaxVersions: false,
      enableCasRequired: false,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid },
  } = form;

  const enableDeactivateVersionAfter = useWatch({
    control,
    name: 'enableDeactivateVersionAfter',
    defaultValue: false,
  });
  const enableMaxVersions = useWatch({
    control,
    name: 'enableMaxVersions',
    defaultValue: false,
  });
  const enableCasRequired = useWatch({
    control,
    name: 'enableCasRequired',
    defaultValue: false,
  });
  const enableCustomMetadata = useWatch({
    control,
    name: 'enableCustomMetadata',
    defaultValue: false,
  });

  /* Submit */
  const { mutate: createSecret, isPending } = useCreateSecret({
    onSuccess: async (data) => {
      if (!okmsId) return;
      await queryClient.invalidateQueries({
        queryKey: secretQueryKeys.list(okmsId),
      });

      trackPage({
        pageType: PageType.bannerSuccess,
        pageTags: ['create', 'secret'],
      });

      navigate(SECRET_MANAGER_ROUTES_URLS.secret(okmsId, data.path));
    },
    onError: (error) => {
      trackPage({
        pageType: PageType.bannerError,
        pageTags: ['create', 'secret'],
      });
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error.response?.data.message,
        }),
      );
    },
  });

  const handleConfirmClick: SubmitHandler<SecretSchema> = (formData) => {
    if (!okmsId) return;

    // Build metadata object only with enabled fields
    const metadata: {
      casRequired?: boolean;
      customMetadata?: Record<string, string>;
      deactivateVersionAfter?: string;
      maxVersions?: number;
    } = {};

    if (formData.enableCasRequired && formData.casRequired) {
      metadata.casRequired = formValueToCasRequired(formData.casRequired);
    }

    if (formData.enableDeactivateVersionAfter && formData.deactivateVersionAfter) {
      metadata.deactivateVersionAfter = formData.deactivateVersionAfter;
    }

    if (formData.enableMaxVersions && formData.maxVersions !== undefined) {
      metadata.maxVersions = formData.maxVersions;
    }

    if (formData.enableCustomMetadata && formData.customMetadata !== undefined) {
      const customMetadata = safeJsonParse<Record<string, string>>(formData.customMetadata);
      if (Object.keys(customMetadata).length > 0) {
        metadata.customMetadata = customMetadata;
      }
    }

    // Transform the flat form data into the nested structure expected by the API
    const transformedData = {
      okmsId,
      data: {
        path: formData.path,
        version: {
          data: safeJsonParse<SecretVersionDataField>(formData.data),
        },
        // Only include metadata if at least one field is enabled
        ...(Object.keys(metadata).length > 0 && { metadata }),
      },
    };

    createSecret(transformedData);
  };

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit(handleConfirmClick)}>
        <div className="flex flex-col gap-5">
          <Text preset="heading-2">{t('create_secret_form_secret_section_title')}</Text>
          <div className="flex flex-col gap-3">
            <Text preset="heading-4">{PATH_LABEL}</Text>
            <SecretPathFormField name="path" control={control} />
          </div>
          <div className="flex flex-col gap-3">
            <Text preset="heading-4">{t('values')}</Text>
            <SecretDataFormField name={'data'} control={control} />
          </div>
          <div className="flex flex-col gap-3">
            <Text preset="heading-4">{t('secret_settings')}</Text>
            <Message dismissible={false}>{t('secret_settings_explanation')}</Message>

            {/* Deactivate Version After with Toggle */}
            <Card color="neutral">
              <div className="flex items-center p-4">
                <Controller
                  name="enableDeactivateVersionAfter"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      name={field.name}
                      id="enable-deactivate-version-after"
                      checked={!!field.value}
                      onCheckedChange={(detail) => {
                        const checked = detail.checked;
                        field.onChange(checked);
                        if (!checked) {
                          // Reset to undefined when disjuabled
                          setValue('deactivateVersionAfter', undefined, { shouldValidate: true });
                        }
                      }}
                      data-testid={SECRET_FORM_TEST_IDS.TOGGLE_DEACTIVATE_VERSION_AFTER}
                    >
                      <ToggleControl />
                      <ToggleLabel>
                        <Text preset="span">{t('enable_deactivate_version_after')}</Text>
                      </ToggleLabel>
                    </Toggle>
                  )}
                />
              </div>
              {enableDeactivateVersionAfter && (
                <div className="rounded-b-[--ods-card-border-radius] border-0 border-t border-solid border-[--ods-color-neutral-200] bg-gray-100 p-4">
                  <SecretDeactivateVersionAfterFormField
                    name="deactivateVersionAfter"
                    control={control}
                  />
                </div>
              )}
            </Card>

            {/* Max Versions with Toggle */}
            <Card color="neutral">
              <div className="flex items-center p-4">
                <Controller
                  name="enableMaxVersions"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      name={field.name}
                      id="enable-max-versions"
                      checked={!!field.value}
                      onCheckedChange={(detail) => {
                        const checked = detail.checked;
                        field.onChange(checked);

                        // Reset to undefined when disabled
                        if (!checked) {
                          setValue('maxVersions', undefined, { shouldValidate: true });
                        }
                      }}
                      data-testid={SECRET_FORM_TEST_IDS.TOGGLE_MAX_VERSIONS}
                    >
                      <ToggleControl />
                      <ToggleLabel>
                        <Text preset="span">{t('enable_max_versions')}</Text>
                      </ToggleLabel>
                    </Toggle>
                  )}
                />
              </div>
              {enableMaxVersions && (
                <div className="rounded-b-[--ods-card-border-radius] border-0 border-t border-solid border-[--ods-color-neutral-200] bg-gray-100 p-4">
                  <SecretMaxVersionsFormField
                    name="maxVersions"
                    control={control}
                    okmsId={okmsId}
                  />
                </div>
              )}
            </Card>

            {/* CAS Required with Toggle */}
            <Card color="neutral">
              <div className="flex items-center p-4">
                <Controller
                  name="enableCasRequired"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      name={field.name}
                      id="enable-cas-required"
                      checked={!!field.value}
                      onCheckedChange={(detail) => {
                        const checked = detail.checked;
                        field.onChange(checked);
                        // Reset to undefined when disabled
                        if (!checked) {
                          setValue('casRequired', undefined, { shouldValidate: true });
                        }
                      }}
                      data-testid={SECRET_FORM_TEST_IDS.TOGGLE_CAS_REQUIRED}
                    >
                      <ToggleControl />
                      <ToggleLabel>
                        <Text preset="span">{t('enable_cas_required')}</Text>
                      </ToggleLabel>
                    </Toggle>
                  )}
                />
              </div>
              {enableCasRequired && (
                <div className="rounded-b-[--ods-card-border-radius] border-0 border-t border-solid border-[--ods-color-neutral-200] bg-gray-100 p-4">
                  <SecretCasRequiredFormField
                    name="casRequired"
                    control={control}
                    okmsId={okmsId}
                  />
                </div>
              )}
            </Card>
          </div>
          <div
            className="flex flex-col gap-3"
            data-testid={SECRET_FORM_TEST_IDS.CUSTOM_METADATA_SECTION}
          >
            <Text preset="heading-4">{t('custom_metadata_title')}</Text>
            <Card color="neutral">
              <div className="flex items-center p-4">
                <Controller
                  name="enableCustomMetadata"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      name={field.name}
                      id="enable-custom-metadata"
                      checked={!!field.value}
                      onCheckedChange={(detail) => {
                        const checked = detail.checked;
                        field.onChange(checked);
                        if (checked) {
                          // One empty row when opening the section ('' => stringToKeyValuePairs gives one row)
                          setValue('customMetadata', '', { shouldValidate: true });
                        } else {
                          setValue('customMetadata', undefined, { shouldValidate: true });
                        }
                      }}
                      data-testid={SECRET_FORM_TEST_IDS.TOGGLE_CUSTOM_METADATA}
                    >
                      <ToggleControl />
                      <ToggleLabel>
                        <Text preset="span">{t('custom_metadata_title')}</Text>
                      </ToggleLabel>
                    </Toggle>
                  )}
                />
              </div>
              {enableCustomMetadata && (
                <div className="rounded-b-[--ods-card-border-radius] border-0 border-t border-solid border-[--ods-color-neutral-200] bg-gray-100 p-4">
                  <KeyValuesEditor name="customMetadata" control={control} allowDeleteLastItem />
                </div>
              )}
            </Card>
          </div>
        </div>
        {/* TEMP: waiting for payment informations */}
        {/* <div className="flex flex-col gap-5">
        <Text preset="heading-2">{t('create_secret_form_payment_section_title')}</Text>
      </div> */}
        <div className="flex items-center justify-between py-3">
          <SecretFormBackLink />
          <Button
            type="submit"
            disabled={!isDirty || !isValid || !okmsId}
            loading={isPending}
            data-testid={SECRET_FORM_TEST_IDS.SUBMIT_BUTTON}
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['create', 'secret'],
              });
            }}
          >
            {t('create', { ns: NAMESPACES.ACTIONS })}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
