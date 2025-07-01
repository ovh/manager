import React, { useState } from 'react';
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
  useSecretPathSchema,
  UseSecretValueSchema,
} from '@secret-manager/validation/secretSchema';
import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { secretListQueryKey } from '@secret-manager/data/api/secrets';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateSecret } from '@secret-manager/data/hooks/useCreateSecret';
import { DomainManagement } from './DomainManagement.component';

export default function SecretCreatePage() {
  const { t } = useTranslation([
    'secret-manager/create',
    NAMESPACES.ACTIONS,
    NAMESPACES.ERROR,
  ]);
  const navigate = useNavigate();
  const { addError } = useNotifications();
  const queryClient = useQueryClient();

  /* domain from the secret list */
  const [searchParams] = useSearchParams();
  const backDomainId = searchParams.get(SECRET_MANAGER_SEARCH_PARAMS.domainId);

  const backLink = backDomainId
    ? useHref(SECRET_MANAGER_ROUTES_URLS.secretListing(backDomainId))
    : useHref(SECRET_MANAGER_ROUTES_URLS.secretManagerRoot);

  /* Selected Domain */
  const [selectedDomainId, setSelectedDomainId] = useState<string>();

  /* Form */
  const pathSchema = useSecretPathSchema();
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
  const { mutateAsync: createSecret, isPending } = useCreateSecret();

  const handleConfirmClick: SubmitHandler<SecretSchema> = async (formData) => {
    try {
      const result = await createSecret({
        okmsId: selectedDomainId,
        data: {
          path: formData.path,
          version: { data: JSON.parse(formData.data) },
        },
      });

      await queryClient.invalidateQueries({
        queryKey: secretListQueryKey(selectedDomainId),
      });

      navigate(
        SECRET_MANAGER_ROUTES_URLS.secretDashboard(
          selectedDomainId,
          result.path,
        ),
      );
    } catch (error) {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error.message,
        }),
      );
    }
  };

  /* Render */
  return (
    <BaseLayout header={{ title: t('title') }} message={<Notifications />}>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(handleConfirmClick)}
      >
        <DomainManagement
          selectedDomainId={selectedDomainId}
          setSelectedDomainId={setSelectedDomainId}
        />
        <div className="flex flex-col gap-5">
          <OdsText preset="heading-2">{t('values_section_title')}</OdsText>
          <div className="flex flex-col gap-3">
            <OdsText preset="heading-4">{t('path_title')}</OdsText>
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
            <OdsText preset="heading-4">{t('values_title')}</OdsText>
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
          <Links
            label={t('back', { ns: NAMESPACES.ACTIONS })}
            type={LinkType.back}
            href={backLink}
          />
          <OdsButton
            type="submit"
            isDisabled={!isDirty || !isValid || !selectedDomainId}
            isLoading={isPending}
            label={t('create', { ns: NAMESPACES.ACTIONS })}
          />
        </div>
      </form>
    </BaseLayout>
  );
}
