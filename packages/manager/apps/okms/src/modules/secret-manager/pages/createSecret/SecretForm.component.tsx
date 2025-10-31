import React from 'react';
import {
  Controller,
  SubmitHandler,
  useForm,
  FormProvider,
} from 'react-hook-form';
import { z } from 'zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { SecretDataFormField } from '@secret-manager/components/form/secretDataFormField/SecretDataFormField.component';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { secretQueryKeys } from '@secret-manager/data/api/secrets';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateSecret } from '@secret-manager/data/hooks/useCreateSecret';
import {
  useSecretPathSchema,
  useSecretDataSchema,
} from '@secret-manager/validation';
import { SECRET_FORM_TEST_IDS } from '@secret-manager/pages/createSecret/SecretForm.constants';
import { SecretFormBackLink } from './BackLink.component';
import { SECRET_DATA_TEMPLATE } from './SecretForm.constants';
import { PATH_LABEL } from '@/constants';

type SecretFormProps = {
  okmsId?: string;
};

export const SecretForm = ({ okmsId }: SecretFormProps) => {
  const { t } = useTranslation([
    'secret-manager',
    NAMESPACES.ACTIONS,
    NAMESPACES.ERROR,
  ]);
  const navigate = useNavigate();
  const { addError } = useNotifications();
  const queryClient = useQueryClient();

  /* Form */
  const pathSchema = useSecretPathSchema();
  const dataSchema = useSecretDataSchema();
  const secretSchema = z.object({ path: pathSchema, data: dataSchema });
  type SecretSchema = z.infer<typeof secretSchema>;

  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(secretSchema),
    defaultValues: {
      path: '',
      // Prefill data with a template to help the user with the JSON format
      data: SECRET_DATA_TEMPLATE,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = form;

  /* Submit */
  const { mutate: createSecret, isPending } = useCreateSecret({
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: secretQueryKeys.list(okmsId),
      });

      navigate(SECRET_MANAGER_ROUTES_URLS.secret(okmsId, data.path));
    },
    onError: (error) => {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error.response.data.message,
        }),
      );
    },
  });

  const handleConfirmClick: SubmitHandler<SecretSchema> = (formData) => {
    createSecret({
      okmsId,
      data: {
        path: formData.path,
        version: { data: JSON.parse(formData.data) },
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={handleSubmit(handleConfirmClick)}
      >
        <div className="flex flex-col gap-5">
          <OdsText preset="heading-2">
            {t('create_secret_form_secret_section_title')}
          </OdsText>
          <div className="flex flex-col gap-3">
            <OdsText preset="heading-4">{PATH_LABEL}</OdsText>
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
                  <OdsText slot="helper" preset="caption">
                    {t('path_field_helper')}
                  </OdsText>
                </OdsFormField>
              )}
            />
          </div>
          <div className="flex flex-col gap-3">
            <OdsText preset="heading-4">{t('values')}</OdsText>
            <SecretDataFormField name={'data'} control={control} />
          </div>
          {/* TEMP: waiting for metadata management */}
          {/* <div className="flex flex-col gap-3">
          <OdsText preset="heading-4">{t('custom_metadata_title')}</OdsText>
        </div>
        <div className="flex flex-col gap-3">
          <OdsText preset="heading-4">{t('settings_default')}</OdsText>
        </div> */}
        </div>
        {/* TEMP: waiting for payment informations */}
        {/* <div className="flex flex-col gap-5">
        <OdsText preset="heading-2">{t('create_secret_form_payment_section_title')}</OdsText>
      </div> */}
        <div className="flex justify-between items-center py-3">
          <SecretFormBackLink />
          <OdsButton
            type="submit"
            isDisabled={!isDirty || !isValid || !okmsId}
            isLoading={isPending}
            label={t('create', { ns: NAMESPACES.ACTIONS })}
            data-testid={SECRET_FORM_TEST_IDS.SUBMIT_BUTTON}
          />
        </div>
      </form>
    </FormProvider>
  );
};
