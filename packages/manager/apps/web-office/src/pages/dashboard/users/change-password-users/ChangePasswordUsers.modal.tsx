import { useContext, useEffect, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  MODAL_COLOR,
  Password,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { CANCEL, CONFIRM, EDIT_PASSWORD } from '@/Tracking.constants';
import { GeneratePasswordButton } from '@/components/generate-password-button/GeneratePasswordButton.component';
import { UserChangePasswordType } from '@/data/api/ApiType';
import { postUsersPassword } from '@/data/api/users/api';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';
import { zForm } from '@/utils/FormSchemas.utils';

export default function ModalChangePasswordUsers() {
  const { t } = useTranslation([
    'dashboard/users/change-password',
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.FORM,
  ]);
  const { trackClick } = useOvhTracking();
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
      email: isAutomatic ? emailUser : '',
    },
    mode: 'onChange',
    resolver: zodResolver(
      zForm(t, activationEmail.split('@')[0], isAutomatic).CHANGE_PASSWORD_USERS_FORM_SCHEMA,
    ),
  });

  const { mutate: editPassword, isPending: isSending } = useMutation({
    mutationFn: (params: UserChangePasswordType) =>
      postUsersPassword(licencePrepaidName || serviceName, activationEmail, params),
    onSuccess: () => {
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('dashboard_users_change_password_message_success')}
        </Text>,
        true,
      );
      onClose();
    },
    onError: (error: ApiError) => {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('dashboard_users_change_password_message_error', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
  });

  useEffect(() => {
    void trigger();
  }, [trigger]);

  const tracking = (action: string) =>
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EDIT_PASSWORD, action],
    });

  const handleSaveClick: SubmitHandler<{
    password: string;
    email: string;
  }> = ({ password, email }) => {
    tracking(CONFIRM);
    editPassword({
      password,
      notifyEmail: email,
      shouldSendMail: !!email,
    });
  };
  const handleCancelClick = () => {
    tracking(CANCEL);
    onClose();
  };

  return (
    <Modal
      heading={t(`${NAMESPACES.ACTIONS}:change_password`)}
      type={MODAL_COLOR.information}
      open={true}
      secondaryButton={{ label: t(`${NAMESPACES.ACTIONS}:cancel`), onClick: handleCancelClick }}
      onOpenChange={handleCancelClick}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        disabled: !isValid,
        onClick: () => void handleSubmit(handleSaveClick)(),
        loading: isSending,
      }}
    >
      <form className="flex flex-col" onSubmit={(e) => void handleSubmit(handleSaveClick)(e)}>
        <Text preset={TEXT_PRESET.paragraph} className="mb-4">
          {t(`${NAMESPACES.FORM}:label_mandatory`)}
        </Text>
        <FormField>
          <RadioGroup
            value={isAutomatic ? 'passwordAutomatic' : 'passwordManual'}
            onValueChange={(e) => {
              setValue('email', e.value === 'passwordAutomatic' ? emailUser : null);
              setIsAutomatic(e.value === 'passwordAutomatic');
            }}
          >
            <Radio data-testid="radio-automatic" value="passwordAutomatic">
              <RadioControl />
              <RadioLabel>{t('dashboard_users_change_password_radio_1')}</RadioLabel>
            </Radio>
            <Radio value="passwordManual" data-testid="radio-manual">
              <RadioControl />
              <RadioLabel>{t('dashboard_users_change_password_radio_2')}</RadioLabel>
            </Radio>
          </RadioGroup>
        </FormField>
        {!isAutomatic && (
          <>
            <Controller
              name="password"
              control={control}
              render={({ field: { name, value, onBlur, onChange } }) => (
                <FormField className="mt-4" invalid={!!errors?.password?.message}>
                  <FormFieldLabel>
                    {t('dashboard_users_change_password_label_password')}*
                  </FormFieldLabel>
                  <div className="flex flex-1 gap-4">
                    <Password
                      name={name}
                      value={value}
                      invalid={!!errors.password}
                      onBlur={onBlur}
                      onChange={onChange}
                      data-testid="input-password"
                      className="w-full"
                    />
                    <GeneratePasswordButton
                      id="generate-password-btn"
                      onGenerate={(password: string) => {
                        setValue('password', password);
                      }}
                    />
                  </div>
                  <FormFieldError>{errors?.password?.message}</FormFieldError>
                </FormField>
              )}
            />
            <Text preset={TEXT_PRESET.paragraph} className="mt-6">
              <div>{t(`${NAMESPACES.FORM}:change_password_helper1`)}</div>
              <ul className="mt-0">
                <li>{t(`${NAMESPACES.FORM}:min_chars`, { value: 8 })}</li>
                <li>{t(`${NAMESPACES.FORM}:max_chars`, { value: 16 })}</li>
                <li>
                  {t(`${NAMESPACES.FORM}:change_password_helper2`)} {'(~!$%^&*_-+=|():;"\'<>,.?)'}
                </li>
                <li>{t(`dashboard_users_change_password_helper3`)}</li>
              </ul>
            </Text>
          </>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { name, value, onBlur, onChange } }) => (
            <FormField className="my-4 w-full" invalid={!!errors?.email?.message}>
              <FormFieldLabel>
                {t('dashboard_users_change_password_label_email')}
                {isAutomatic && '*'}
              </FormFieldLabel>
              <Input
                name={name}
                value={value}
                data-testid="input-email"
                invalid={!!errors.email}
                onBlur={onBlur}
                onChange={onChange}
                type={INPUT_TYPE.email}
                clearable
              />
              <FormFieldError>{errors?.email?.message}</FormFieldError>
            </FormField>
          )}
        />
      </form>
    </Modal>
  );
}
