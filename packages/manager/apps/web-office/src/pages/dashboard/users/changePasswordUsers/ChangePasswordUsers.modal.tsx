import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  OdsFormField,
  OdsInput,
  OdsPassword,
  OdsText,
  OdsRadio,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGenerateUrl } from '@/hooks';
import { postUsersPassword } from '@/data/api/users';
import { CHANGE_PASSWORD_USERS_FORM_SCHEMA } from '@/utils/formSchemas.utils';
import { UserChangePasswordType } from '@/data/api/api.type';

export default function ModalChangePasswordUsers() {
  const { t } = useTranslation(['dashboard/users/change-password', 'common']);
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);
  const context = useContext(ShellContext);
  const emailUser = context?.environment?.user?.email;
  const { serviceName } = useParams() || {};
  const [searchParams] = useSearchParams();
  const licencePrepaidName = searchParams.get('licencePrepaidName') || '';
  const activationEmail = searchParams.get('activationEmail') || '';
  const { addError, addSuccess } = useNotifications();
  const [isAutomatic, setIsAutomatic] = useState(true);
  const {
    control,
    handleSubmit,
    trigger,
    formState: { isValid, errors },
    setValue,
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
      email: isAutomatic ? emailUser : '',
    },
    mode: 'onChange',
    resolver: zodResolver(CHANGE_PASSWORD_USERS_FORM_SCHEMA),
  });

  const { mutate: editPassword, isPending: isSending } = useMutation({
    mutationFn: (params: UserChangePasswordType) =>
      postUsersPassword(
        licencePrepaidName || serviceName,
        activationEmail,
        params,
      ),
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('dashboard_users_change_password_message_success')}
        </OdsText>,
        true,
      );
      onClose();
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('dashboard_users_change_password_message_error', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
  });

  useEffect(() => {
    trigger();
  }, []);

  const handleSaveClick: SubmitHandler<{
    password: string;
    email: string;
  }> = ({ password, email }) => {
    editPassword({
      password,
      notifyEmail: email,
      shouldSendMail: !!email,
    });
  };
  const handleCancelClick = () => {
    onClose();
  };

  return (
    <Modal
      heading={t('dashboard_users_change_password_title')}
      type={ODS_MODAL_COLOR.information}
      isOpen={true}
      secondaryLabel={t('common:cta_cancel')}
      onSecondaryButtonClick={handleCancelClick}
      onDismiss={handleCancelClick}
      primaryLabel={t('common:cta_confirm')}
      isPrimaryButtonDisabled={!isValid}
      onPrimaryButtonClick={handleSubmit(handleSaveClick)}
      isPrimaryButtonLoading={isSending}
    >
      <form className="flex flex-col" onSubmit={handleSubmit(handleSaveClick)}>
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-4">
          {t('common:common_field_label_mandatory')}
        </OdsText>
        <OdsFormField>
          <span>
            <OdsRadio
              name="passwordAutomatic"
              inputId="radio-automatic"
              isChecked={isAutomatic}
              onOdsChange={() => {
                setValue('email', emailUser);
                setIsAutomatic(true);
              }}
              data-testid="radio-automatic"
              value="passwordAutomatic"
            ></OdsRadio>
            <label htmlFor="radio-automatic" className="ml-4">
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('dashboard_users_change_password_radio_1')}
              </OdsText>
            </label>
          </span>
          <span>
            <OdsRadio
              name="passwordManual"
              inputId="radio-manual"
              value="passwordManual"
              isChecked={!isAutomatic}
              onOdsChange={() => {
                setValue('email', null);
                setIsAutomatic(false);
              }}
              isRequired={isAutomatic}
              data-testid="radio-manual"
            ></OdsRadio>
            <label htmlFor="radio-manual" className="ml-4">
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('dashboard_users_change_password_radio_2')}
              </OdsText>
            </label>
          </span>
        </OdsFormField>
        {!isAutomatic && (
          <>
            <Controller
              name="password"
              control={control}
              render={({ field: { name, value, onBlur, onChange } }) => (
                <OdsFormField
                  className="mt-4"
                  error={errors?.password?.message}
                >
                  <label slot="label">
                    {t('dashboard_users_change_password_label_password')}*
                  </label>
                  <OdsPassword
                    name={name}
                    value={value}
                    hasError={!!errors.password}
                    onOdsBlur={onBlur}
                    onOdsChange={onChange}
                    data-testid="input-password"
                    className="w-full"
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
                  error={errors?.confirmPassword?.message}
                >
                  <label slot="label">
                    {t(
                      'dashboard_users_change_password_label_confirm_password',
                    )}
                    *
                  </label>
                  <OdsPassword
                    name={name}
                    value={value}
                    hasError={!!errors.confirmPassword}
                    onOdsBlur={onBlur}
                    onOdsChange={onChange}
                    data-testid="input-confirm-password"
                    className="w-full"
                  />
                </OdsFormField>
              )}
            />
            <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mt-6">
              <div>{t('dashboard_users_change_password_helper1')}</div>
              <ul className="mt-0">
                <li>{t('dashboard_users_change_password_helper2')}</li>
                <li>{t('dashboard_users_change_password_helper3')}</li>
                <li>{t('dashboard_users_change_password_helper4')}</li>
              </ul>
            </OdsText>
          </>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { name, value, onBlur, onChange } }) => (
            <OdsFormField
              className="w-full mt-4 mb-4"
              error={errors?.email?.message}
            >
              <label slot="label">
                {t('dashboard_users_change_password_label_email')}
                {isAutomatic && '*'}
              </label>
              <OdsInput
                name={name}
                value={value}
                data-testid="input-email"
                hasError={!!errors.email}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
                type={ODS_INPUT_TYPE.email}
                isClearable
              />
            </OdsFormField>
          )}
        />
      </form>
    </Modal>
  );
}
