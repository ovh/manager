import { useEffect, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { ApiError } from '@ovh-ux/manager-core-api';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { CANCEL, CONFIRM, EDIT_ACCOUNT } from '@/Tracking.constants';
import { UserParamsType } from '@/data/api/ApiType';
import { putOfficeLicenseDetails } from '@/data/api/license/api';
import { getOfficeLicenseDetailsQueryKey, getOfficeLicenseQueryKey } from '@/data/api/license/key';
import { getOfficeUsersDomain, putOfficeUserDetail } from '@/data/api/users/api';
import {
  getOfficeUserDetailQueryKey,
  getOfficeUserDomainQueryKey,
  getOfficeUsersQueryKey,
} from '@/data/api/users/key';
import { useUserDetail } from '@/data/hooks/user-detail/useUserDetail';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';
import queryClient from '@/queryClient';
import { zForm } from '@/utils/FormSchemas.utils';

export default function ModalEditUsers() {
  const { t } = useTranslation([
    'dashboard/users/edit',
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.FORM,
  ]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const { serviceName: selectedServiceName } = useParams();
  const [searchParams] = useSearchParams();
  const activationEmail = searchParams.get('activationEmail');
  const licencePrepaidName = searchParams.get('licencePrepaidName');
  const { serviceName } = useParams();

  const { addError, addInfo } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { data: userDetail, isLoading: isUserDetailLoading } = useUserDetail(
    activationEmail,
    licencePrepaidName,
  );

  const { data: domain } = useQuery({
    queryKey: [getOfficeUserDomainQueryKey(serviceName)],
    queryFn: () => getOfficeUsersDomain(serviceName),
  });
  const [isLoading, setIsLoading] = useState(!userDetail || isUserDetailLoading);

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
    resolver: zodResolver(zForm(t).EDIT_USERS_FORM_SCHEMA),
  });

  useEffect(() => {
    if (userDetail && !isUserDetailLoading) {
      setValue('firstname', userDetail.firstName);
      setValue('lastname', userDetail.lastName);
      setValue('login', userDetail.activationEmail.split('@')[0]);
      setIsLoading(false);
    }
  }, [userDetail, isUserDetailLoading, setValue]);

  const { mutate: editUser, isPending: isSending } = useMutation({
    mutationFn: (params: UserParamsType) => {
      return licencePrepaidName
        ? putOfficeLicenseDetails(licencePrepaidName, params)
        : putOfficeUserDetail(selectedServiceName, activationEmail, params);
    },
    onSuccess: () => {
      addInfo(
        <Text preset={TEXT_PRESET.paragraph}>{t('dashboard_users_edit_message_success')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('dashboard_users_edit_message_error', {
            error: error.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          licencePrepaidName
            ? getOfficeLicenseQueryKey(selectedServiceName)
            : getOfficeUsersQueryKey(selectedServiceName),
          selectedServiceName,
        ],
      });
      await queryClient.invalidateQueries({
        queryKey: [
          licencePrepaidName
            ? getOfficeLicenseDetailsQueryKey(licencePrepaidName)
            : getOfficeUserDetailQueryKey(serviceName, activationEmail),
          licencePrepaidName,
          serviceName,
          activationEmail,
        ],
      });
      onClose();
    },
  });

  const tracking = (action: string) =>
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EDIT_ACCOUNT, action],
    });

  const handleSaveClick: SubmitHandler<{
    firstname: string;
    lastname: string;
    login: string;
  }> = ({ firstname, lastname, login }) => {
    tracking(CONFIRM);
    editUser({
      firstName: firstname,
      lastName: lastname,
      activationEmail: `${login}@${userDetail.activationEmail.split('@')[1]}`,
    });
  };

  const handleCancelClick = () => {
    tracking(CANCEL);
    onClose();
  };
  return (
    <Modal
      heading={t('dashboard_users_edit_title')}
      type={MODAL_COLOR.information}
      open={true}
      loading={isLoading}
      onOpenChange={handleCancelClick}
      secondaryButton={{ label: t(`${NAMESPACES.ACTIONS}:cancel`), onClick: handleCancelClick }}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        disabled: !isDirty || !isValid,
        onClick: () => void handleSubmit(handleSaveClick)(),
        loading: isSending,
      }}
    >
      <form
        className="flex flex-col gap-y-5 text-left"
        onSubmit={(e) => void handleSubmit(handleSaveClick)(e)}
      >
        <Text preset={TEXT_PRESET.paragraph}>{t(`${NAMESPACES.FORM}:label_mandatory`)}</Text>
        <div className="flex flex-wrap gap-5 sm:flex-nowrap">
          <Controller
            control={control}
            name="firstname"
            rules={{ required: true }}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <FormField invalid={!!errors?.firstname?.message} className="w-full">
                <FormFieldLabel>{t(`${NAMESPACES.FORM}:firstname`)}*</FormFieldLabel>
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid="input-firstname"
                  invalid={!!errors.firstname}
                  onBlur={onBlur}
                  onChange={onChange}
                ></Input>
                <FormFieldError>{errors?.firstname?.message}</FormFieldError>
              </FormField>
            )}
          />
          <Controller
            control={control}
            name="lastname"
            rules={{ required: true }}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <FormField invalid={!!errors?.lastname?.message} className="w-full">
                <FormFieldLabel>{t(`${NAMESPACES.FORM}:lastname`)}*</FormFieldLabel>
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid="input-lastname"
                  invalid={!!errors.lastname}
                  onBlur={onBlur}
                  onChange={onChange}
                ></Input>
                <FormFieldError>{errors?.lastname?.message}</FormFieldError>
              </FormField>
            )}
          />
        </div>
        <Controller
          control={control}
          name="login"
          rules={{ required: true }}
          render={({ field: { name, value, onBlur, onChange } }) => (
            <FormField invalid={!!errors?.login?.message}>
              <FormFieldLabel>{t(`${NAMESPACES.FORM}:login`)}*</FormFieldLabel>
              <div className="flex flex-wrap gap-5 sm:flex-nowrap">
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid="input-login"
                  invalid={!!errors.login}
                  onBlur={onBlur}
                  onChange={onChange}
                  className="w-full"
                ></Input>
                <Input
                  type={INPUT_TYPE.text}
                  name="domain"
                  data-testid="input-domain"
                  disabled
                  value={`@${userDetail.activationEmail.split('@')[1] || domain}`}
                  className="w-full"
                ></Input>
              </div>
              <FormFieldError>{errors?.login?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Text preset={TEXT_PRESET.paragraph}>
          <ul className="mt-0">
            <li>{t('common:form_helper_login_conditions')}</li>
            <li>{t('common:form_helper_login_condition_exception')}</li>
          </ul>
        </Text>
      </form>
    </Modal>
  );
}
