import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  SecretCasRequiredFormField,
  formValueToCasRequired,
} from '@secret-manager/components/form/SecretCasRequiredFormField.component';
import { SecretDeactivateVersionAfterFormField } from '@secret-manager/components/form/SecretDeactivateVersionAfterFormField.component';
import { SecretMaxVersionsFormField } from '@secret-manager/components/form/SecretMaxVersionsFormField.component';
import { SecretDataFormField } from '@secret-manager/components/form/secret-data-form-field/SecretDataFormField.component';
import { secretQueryKeys } from '@secret-manager/data/api/secrets';
import { useCreateSecret } from '@secret-manager/data/hooks/useCreateSecret';
import { SECRET_FORM_TEST_IDS } from '@secret-manager/pages/create-secret/SecretForm.constants';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { SecretVersionDataField } from '@secret-manager/types/secret.type';
import { useSecretDataSchema, useSecretPathSchema } from '@secret-manager/validation';
import { useSecretConfigSchema } from '@secret-manager/validation/secret-config/secretConfigSchema';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';
import { Button } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { PATH_LABEL } from '@/constants';

import { SecretFormBackLink } from './BackLink.component';

type SecretFormProps = {
  okmsId?: string;
};

export const SecretForm = ({ okmsId }: SecretFormProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS, NAMESPACES.ERROR]);
  const navigate = useNavigate();
  const { addError } = useNotifications();
  const queryClient = useQueryClient();
  const { trackClick } = useOkmsTracking();

  /* Form */
  const pathSchema = useSecretPathSchema();
  const dataSchema = useSecretDataSchema();
  const metadataSchema = useSecretConfigSchema();
  const secretSchema = z.object({
    path: pathSchema,
    data: dataSchema,
    deactivateVersionAfter: metadataSchema.shape.deactivateVersionAfter.optional(),
    maxVersions: metadataSchema.shape.maxVersions.optional(),
    casRequired: metadataSchema.shape.casRequired.optional(),
  });
  type SecretSchema = z.infer<typeof secretSchema>;

  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(secretSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = form;

  /* Submit */
  const { mutate: createSecret, isPending } = useCreateSecret({
    onSuccess: async (data) => {
      if (!okmsId) return;
      await queryClient.invalidateQueries({
        queryKey: secretQueryKeys.list(okmsId),
      });

      navigate(SECRET_MANAGER_ROUTES_URLS.secret(okmsId, data.path));
    },
    onError: (error) => {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error.response?.data.message,
        }),
      );
    },
  });

  const handleConfirmClick: SubmitHandler<SecretSchema> = (formData) => {
    if (!okmsId) return;

    // Transform the flat form data into the nested structure expected by the API
    const transformedData = {
      okmsId,
      data: {
        path: formData.path,
        version: {
          data: JSON.parse(formData.data) as SecretVersionDataField,
        },
        metadata: {
          casRequired: formData?.casRequired
            ? formValueToCasRequired(formData.casRequired)
            : undefined,
          deactivateVersionAfter: formData.deactivateVersionAfter,
          maxVersions: formData.maxVersions,
        },
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
            <Controller
              name="path"
              control={control}
              render={({ field: { name, value, onChange, onBlur } }) => (
                <OdsFormField error={errors?.[name]?.message}>
                  <OdsInput
                    id={name}
                    name={name}
                    value={value}
                    onOdsBlur={onBlur}
                    onOdsChange={onChange}
                    data-testid={SECRET_FORM_TEST_IDS.INPUT_PATH}
                  />
                  <Text slot="helper" preset="caption">
                    {t('path_field_helper')}
                  </Text>
                </OdsFormField>
              )}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Text preset="heading-4">{t('values')}</Text>
            <SecretDataFormField name={'data'} control={control} />
          </div>
          {/* TEMP: waiting for custom metadata */}
          {/* <div className="flex flex-col gap-3">
            <OdsText preset="heading-4">{t('custom_metadata_title')}</OdsText>
          </div> */}
          <div className="flex flex-col gap-3">
            <Text preset="heading-4">{t('settings_default')}</Text>
            <SecretDeactivateVersionAfterFormField
              name="deactivateVersionAfter"
              control={control}
            />
            <SecretMaxVersionsFormField name="maxVersions" control={control} okmsId={okmsId} />
            <SecretCasRequiredFormField name="casRequired" control={control} okmsId={okmsId} />
          </div>
        </div>
        {/* TEMP: waiting for payment informations */}
        {/* <div className="flex flex-col gap-5">
        <OdsText preset="heading-2">{t('create_secret_form_payment_section_title')}</OdsText>
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
