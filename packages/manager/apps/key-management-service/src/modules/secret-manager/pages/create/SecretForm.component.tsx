import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { secretQueryKeys } from '@secret-manager/data/api/secrets';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateSecret } from '@secret-manager/data/hooks/useCreateSecret';
import {
  useSecretPathSchema,
  useSecretDataSchema,
} from '@secret-manager/validation';
import {
  DATA_INPUT_TEST_ID,
  PATH_INPUT_TEST_ID,
  SUBMIT_BTN_TEST_ID,
} from '@secret-manager/utils/tests/secret.constants';
import { BackLink } from './BackLink.component';

type SecretFormProps = {
  domainId?: string;
};

export const SecretForm = ({ domainId }: SecretFormProps) => {
  const { t } = useTranslation([
    'secret-manager/create',
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

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm({
    mode: 'onTouched',
    resolver: zodResolver(secretSchema),
  });

  /* Submit */
  const { mutate: createSecret, isPending } = useCreateSecret({
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: secretQueryKeys.list(domainId),
      });

      navigate(SECRET_MANAGER_ROUTES_URLS.secretDashboard(domainId, data.path));
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
      okmsId: domainId,
      data: {
        path: formData.path,
        version: { data: JSON.parse(formData.data) },
      },
    });
  };

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={handleSubmit(handleConfirmClick)}
    >
      <div className="flex flex-col gap-5">
        <OdsText preset="heading-2">{t('secret_section_title')}</OdsText>
        <div className="flex flex-col gap-3">
          <OdsText preset="heading-4">{t('path_title')}</OdsText>
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
                  data-testid={PATH_INPUT_TEST_ID}
                />
                <OdsText slot="helper" preset="caption">
                  {t('path_helper')}
                </OdsText>
              </OdsFormField>
            )}
          />
        </div>
        <div className="flex flex-col gap-3">
          <OdsText preset="heading-4">{t('data_title')}</OdsText>
          <Controller
            name="data"
            control={control}
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField error={errors?.[name]?.message}>
                <label htmlFor={name} slot="label">
                  {t('data_textarea_label')}
                </label>
                <OdsTextarea
                  id={name}
                  name={name}
                  value={value}
                  onOdsBlur={onBlur}
                  onOdsChange={onChange}
                  isResizable
                  rows={12}
                  data-testid={DATA_INPUT_TEST_ID}
                />
              </OdsFormField>
            )}
          />
        </div>
        <div className="flex flex-col gap-3">
          <OdsText preset="heading-4">{t('custom_metadata_title')}</OdsText>
        </div>
        <div className="flex flex-col gap-3">
          <OdsText preset="heading-4">{t('metadata_title')}</OdsText>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <OdsText preset="heading-2">{t('paiement_section_title')}</OdsText>
      </div>
      <div className="flex justify-between items-center py-3">
        <BackLink />
        <OdsButton
          type="submit"
          isDisabled={!isDirty || !isValid || !domainId}
          isLoading={isPending}
          label={t('create', { ns: NAMESPACES.ACTIONS })}
          data-testid={SUBMIT_BTN_TEST_ID}
        />
      </div>
    </form>
  );
};
