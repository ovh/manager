import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  OdsCheckbox,
  OdsFormField,
  OdsInput,
  OdsPassword,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/Modals/Modal';
import { useGenerateUrl } from '@/hooks';
import { postUsersPassword } from '@/api/users';
import { CHANGE_PASSWORD_USERS_FORM_SCHEMA } from '@/utils/formSchemas.utils';
import { UserChangePasswordType } from '@/api/api.type';

export default function ModalChangePasswordUsers() {
  const { t } = useTranslation('dashboard/users/change-password');
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);
  const context = useContext(ShellContext);
  const emailUser = context?.environment?.user?.email;
  const { serviceName } = useParams() || {};
  const [searchParams] = useSearchParams();
  const activationEmail = searchParams.get('activationEmail') || '';
  const { addError, addSuccess } = useNotifications();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
      email: emailUser || '',
      editEmail: '',
    },
    mode: 'onChange',
    resolver: zodResolver(CHANGE_PASSWORD_USERS_FORM_SCHEMA),
  });

  const { mutate: editPassword, isPending: isSending } = useMutation({
    mutationFn: async (params: UserChangePasswordType) =>
      postUsersPassword(serviceName, activationEmail, params),
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('dashboard_users_change-password_message_success')}
        </OdsText>,
        true,
      );
      onClose();
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('dashboard_users_change-password_message_error', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
  });

  const handleSaveClick: SubmitHandler<{
    password: string;
    email: string;
  }> = (data) => {
    editPassword({
      password: data.password,
      notifyEmail: data.email,
      shouldSendMail: true,
    });
  };

  const handleCancelClick = () => {
    onClose();
  };

  return (
    <Modal
      title={t('dashboard_users_change-password_title')}
      isOpen
      onClose={handleCancelClick}
      isDismissible
      secondaryButton={{
        label: t('dashboard_users_change-password_cta_cancel'),
        action: handleCancelClick,
        testid: 'cancel-btn',
        variant: ODS_BUTTON_VARIANT.outline,
      }}
      primaryButton={{
        label: t('dashboard_users_change-password_cta_confirm'),
        action: handleSubmit(handleSaveClick),
        testid: 'confirm-btn',
        isLoading: isSending,
        isDisabled: !isDirty || !isValid,
      }}
    >
      <form
        className="flex flex-col text-left gap-y-5"
        onSubmit={handleSubmit(handleSaveClick)}
      >
        <span>
          <OdsText preset={ODS_TEXT_PRESET.heading6}>
            {t('dashboard_users_change-password_description')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('dashboard_users_change-password_subdescription')}
          </OdsText>
        </span>

        <Controller
          name="password"
          control={control}
          render={({ field: { name, value, onBlur, onChange } }) => (
            <OdsFormField
              className="mt-4"
              error={errors?.password?.message as string}
            >
              <label slot="label">
                {t('dashboard_users_change-password_label1')}
              </label>
              <OdsPassword
                name={name}
                value={value}
                hasError={!!errors.password}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              />
            </OdsFormField>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { name, value, onBlur, onChange } }) => (
            <OdsFormField
              className="mt-4"
              error={errors?.confirmPassword?.message as string}
            >
              <label slot="label">
                {t('dashboard_users_change-password_label2')}
              </label>
              <OdsPassword
                name={name}
                value={value}
                hasError={!!errors.confirmPassword}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              />
            </OdsFormField>
          )}
        />
        <OdsText preset={ODS_TEXT_PRESET.span}>
          <div>{t('dashboard_users_change-password_helper1')}</div>
          <ul>
            <li>{t('dashboard_users_change-password_helper2')}</li>
            <li>{t('dashboard_users_change-password_helper3')}</li>
            <li>{t('dashboard_users_change-password_helper4')}</li>
          </ul>
        </OdsText>

        <OdsText preset={ODS_TEXT_PRESET.heading6}>
          {t('dashboard_users_change-password_email-edit-title')}
        </OdsText>
        <Controller
          control={control}
          name="email"
          render={({ field: { name, value, onBlur, onChange } }) => (
            <OdsFormField className="w-3/4">
              <label slot="label">
                {t('dashboard_users_change-password_label3')}
              </label>
              <OdsInput
                name={name}
                value={value}
                data-testid="input-email"
                hasError={!!errors.email}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
                type={ODS_INPUT_TYPE.email}
                placeholder={t(
                  'dashboard_users_change-password_email-placeholder',
                )}
                isClearable
              />
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name="editEmail"
          render={({ field: { value, onBlur, onChange } }) => (
            <OdsFormField className="w-3/4 inline-block">
              <OdsCheckbox
                name="editMail"
                value={value}
                className="mr-4"
                onOdsChange={onChange}
                onOdsBlur={onBlur}
              />
              <OdsText preset={ODS_TEXT_PRESET.heading6}>
                {t('dashboard_users_change-password_email-edit')}
              </OdsText>
            </OdsFormField>
          )}
        />
      </form>
    </Modal>
  );
}
