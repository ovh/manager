import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsIcon,
  OdsInput,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGenerateUrl, useOfficeUserDetail } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import queryClient from '@/queryClient';
import { EDIT_USERS_FORM_SCHEMA } from '@/utils/formSchemas.utils';
import {
  getOfficeLicenseQueryKey,
  putOfficeLicenseDetails,
} from '@/api/license';
import { getOfficeUsersQueryKey, putOfficeUserDetail } from '@/api/users';
import { UserParamsType } from '@/api/api.type';

export default function ModalEditUsers() {
  const { t } = useTranslation(['dashboard/users/edit', 'common']);
  const navigate = useNavigate();

  const { serviceName: selectedServiceName } = useParams();
  const [searchParams] = useSearchParams();
  const activationEmail = searchParams.get('activationEmail');
  const licencePrepaidName = searchParams.get('licencePrepaidName');

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const {
    data: userDetail,
    isLoading: isUserDetailLoading,
  } = useOfficeUserDetail(activationEmail, licencePrepaidName);

  const [isLoading, setIsLoading] = useState(
    !userDetail || isUserDetailLoading,
  );

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      firstname: userDetail?.firstName || '',
      lastname: userDetail?.lastName || '',
      login: userDetail?.activationEmail.split('@')[0] || '',
    },
    mode: 'onChange',
    resolver: zodResolver(EDIT_USERS_FORM_SCHEMA),
  });

  useEffect(() => {
    if (userDetail && !isUserDetailLoading) {
      setValue('firstname', userDetail.firstName);
      setValue('lastname', userDetail.lastName);
      setValue('login', userDetail.activationEmail.split('@')[0]);
      setIsLoading(false);
    }
  }, [userDetail, isUserDetailLoading]);

  const { mutate: editUser, isPending: isSending } = useMutation({
    mutationFn: (params: UserParamsType) => {
      return licencePrepaidName
        ? putOfficeLicenseDetails(licencePrepaidName, params)
        : putOfficeUserDetail(selectedServiceName, activationEmail, params);
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('dashboard_users_edit_message_success')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('dashboard_users_edit_message_error', {
            error: error.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          licencePrepaidName
            ? getOfficeLicenseQueryKey(selectedServiceName)
            : getOfficeUsersQueryKey(selectedServiceName),
        ],
      });
      onClose();
    },
  });

  const handleSaveClick: SubmitHandler<{
    firstname: string;
    lastname: string;
    login: string;
  }> = ({ firstname, lastname, login }) =>
    editUser({
      firstName: firstname,
      lastName: lastname,
      activationEmail: `${login}@${userDetail.activationEmail.split('@')[1]}`,
    });

  const handleCancelClick = () => {
    onClose();
  };

  return (
    <Modal
      isOpen
      title={t('dashboard_users_edit_title')}
      color={ODS_MODAL_COLOR.information}
      onClose={onClose}
      isDismissible
      isLoading={isLoading}
      secondaryButton={{
        label: t('common:cta_cancel'),
        action: handleCancelClick,
      }}
      primaryButton={{
        testid: 'edit-btn',
        variant: ODS_BUTTON_VARIANT.default,
        label: t('common:cta_confirm'),
        isDisabled: !isDirty || !isValid,
        isLoading: isSending,
        action: handleSubmit(handleSaveClick),
      }}
    >
      <form
        className="flex flex-col text-left gap-y-5"
        onSubmit={handleSubmit(handleSaveClick)}
      >
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('dashboard_users_edit_mandatory_field')}
        </OdsText>

        <Controller
          control={control}
          name="firstname"
          rules={{ required: true }}
          render={({ field: { name, value, onBlur, onChange } }) => (
            <OdsFormField error={errors?.firstname?.message as string}>
              <label slot="label">
                {t('dashboard_users_edit_form_label_firstname')} *
              </label>

              <OdsInput
                type={ODS_INPUT_TYPE.text}
                name={name}
                value={value}
                data-testid="input-firstname"
                hasError={!!errors.firstname}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              ></OdsInput>
            </OdsFormField>
          )}
        />

        <Controller
          control={control}
          name="lastname"
          rules={{ required: true }}
          render={({ field: { name, value, onBlur, onChange } }) => (
            <OdsFormField error={errors?.lastname?.message as string}>
              <label slot="label">
                {t('dashboard_users_edit_form_label_lastname')} *
              </label>

              <OdsInput
                type={ODS_INPUT_TYPE.text}
                name={name}
                value={value}
                data-testid="input-lastname"
                hasError={!!errors.lastname}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              ></OdsInput>
            </OdsFormField>
          )}
        />

        <Controller
          control={control}
          name="login"
          rules={{ required: true }}
          render={({ field: { name, value, onBlur, onChange } }) => (
            <OdsFormField error={errors?.login?.message as string}>
              <label htmlFor="label" slot="label">
                {t('dashboard_users_edit_form_label_login')} *
                <OdsIcon
                  id="tooltip-trigger"
                  className="ml-3 text-xs"
                  name={ODS_ICON_NAME.circleQuestion}
                ></OdsIcon>
                <OdsTooltip
                  role="tooltip"
                  strategy="fixed"
                  triggerId="tooltip-trigger"
                >
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    <p className="m-0">
                      {t('dashboard_users_edit_form_helper_login_conditions')}
                    </p>
                    <p className="m-0">
                      {t(
                        'dashboard_users_edit_form_helper_login_condition_exception',
                      )}
                    </p>
                  </OdsText>
                </OdsTooltip>
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                name={name}
                value={value}
                data-testid="input-login"
                hasError={!!errors.login}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              ></OdsInput>
            </OdsFormField>
          )}
        />
      </form>
    </Modal>
  );
}
