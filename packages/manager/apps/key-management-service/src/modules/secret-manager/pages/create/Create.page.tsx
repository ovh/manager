import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BaseLayout,
  Links,
  LinkType,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref, useNavigate, useSearchParams } from 'react-router-dom';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import {
  UseSecretPathSchema,
  UseSecretValueSchema,
} from '@secret-manager/validation/secretSchema';
import { usePostSecret } from '@secret-manager/data/hooks/usePostSecret';
import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';

export default function SecretCreatePage() {
  const { t } = useTranslation([
    'secret-manager/create',
    NAMESPACES.ACTIONS,
    NAMESPACES.ERROR,
  ]);
  const navigate = useNavigate();
  const { addError } = useNotifications();

  /* domain */
  const [searchParams, setSearchParams] = useSearchParams();
  const domainId = searchParams.get(SECRET_MANAGER_SEARCH_PARAMS.domainId);

  /* Form */
  const pathSchema = UseSecretPathSchema();
  const valueSchema = UseSecretValueSchema();
  const secretSchema = z.object({ path: pathSchema, data: valueSchema });
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
  const { mutate: createSecret, isPending } = usePostSecret({
    onSuccess: ({ path }) =>
      navigate(SECRET_MANAGER_ROUTES_URLS.secretDashboard(domainId, path)),
    onError: (error) => {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error.message,
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

  /* Render */
  return (
    <BaseLayout header={{ title: t('title') }} message={<Notifications />}>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(handleConfirmClick)}
      >
        <div className="flex flex-col gap-5">
          <OdsText preset="heading-2">{t('region_section_title')}</OdsText>
        </div>
        <div className="flex flex-col gap-5">
          <OdsText preset="heading-2">{t('values_section_title')}</OdsText>
          <div className="flex flex-col gap-3">
            <OdsText preset="heading-3">{t('path_title')}</OdsText>
            <Controller
              name="path"
              control={control}
              render={({
                field: { name, value, onChange, onBlur },
              }): React.ReactElement => (
                <OdsFormField error={errors?.[name]?.message}>
                  <OdsInput
                    id={name}
                    name={name}
                    value={value}
                    onOdsBlur={onBlur}
                    onOdsChange={onChange}
                  />
                  <OdsText slot="helper" preset="caption">
                    {t('path_helper')}
                  </OdsText>
                </OdsFormField>
              )}
            />
          </div>
          <div className="flex flex-col gap-3">
            <OdsText preset="heading-3">{t('values_title')}</OdsText>
            <Controller
              name="data"
              control={control}
              render={({
                field: { name, value, onChange, onBlur },
              }): React.ReactElement => (
                <OdsFormField error={errors?.[name]?.message}>
                  <label htmlFor={name} slot="label">
                    {t('values_textarea_label')}
                  </label>
                  <OdsTextarea
                    id={name}
                    name={name}
                    value={value}
                    onOdsBlur={onBlur}
                    onOdsChange={onChange}
                    isResizable
                    rows={12}
                  />
                </OdsFormField>
              )}
            />
          </div>
          <div className="flex flex-col gap-3">
            <OdsText preset="heading-3">{t('custom_metadata_title')}</OdsText>
          </div>
          <div className="flex flex-col gap-3">
            <OdsText preset="heading-3">{t('metadata_title')}</OdsText>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <OdsText preset="heading-2">{t('paiement_section_title')}</OdsText>
        </div>
        <div className="flex justify-between items-center py-3">
          <Links
            label={t('back', { ns: NAMESPACES.ACTIONS })}
            type={LinkType.back}
            href={useHref(SECRET_MANAGER_ROUTES_URLS.secretListing(domainId))}
          />
          <OdsButton
            type="submit"
            isDisabled={!isDirty || !isValid}
            isLoading={isPending}
            label={t('create', { ns: NAMESPACES.ACTIONS })}
          />
        </div>
      </form>
    </BaseLayout>
  );
}
