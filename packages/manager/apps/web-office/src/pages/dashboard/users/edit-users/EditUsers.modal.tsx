import { useEffect, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_INPUT_TYPE, ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

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
      type={ODS_MODAL_COLOR.information}
      isOpen={true}
      isLoading={isLoading}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
      onDismiss={handleCancelClick}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      isPrimaryButtonDisabled={!isDirty || !isValid}
      onPrimaryButtonClick={() => void handleSubmit(handleSaveClick)()}
      isPrimaryButtonLoading={isSending}
    >
      <form
        className="flex flex-col text-left gap-y-5"
        onSubmit={(e) => void handleSubmit(handleSaveClick)(e)}
      >
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.FORM}:label_mandatory`)}
        </OdsText>
        <div className="flex flex-wrap sm:flex-nowrap gap-5">
          <Controller
            control={control}
            name="firstname"
            rules={{ required: true }}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <OdsFormField error={errors?.firstname?.message} className="w-full">
                <label slot="label">{t(`${NAMESPACES.FORM}:firstname`)}*</label>

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
              <OdsFormField error={errors?.lastname?.message} className="w-full">
                <label slot="label">{t(`${NAMESPACES.FORM}:lastname`)}*</label>

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
        </div>
        <Controller
          control={control}
          name="login"
          rules={{ required: true }}
          render={({ field: { name, value, onBlur, onChange } }) => (
            <OdsFormField error={errors?.login?.message}>
              <label htmlFor="label" slot="label">
                {t(`${NAMESPACES.FORM}:login`)}*
              </label>
              <div className="flex flex-wrap sm:flex-nowrap gap-5">
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid="input-login"
                  hasError={!!errors.login}
                  onOdsBlur={onBlur}
                  onOdsChange={onChange}
                  className="w-full"
                ></OdsInput>
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name="domain"
                  data-testid="input-domain"
                  isDisabled
                  value={`@${userDetail.activationEmail.split('@')[1] || domain}`}
                  className="w-full"
                ></OdsInput>
              </div>
            </OdsFormField>
          )}
        />
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <ul className="mt-0">
            <li>{t('common:form_helper_login_conditions')}</li>
            <li>{t('common:form_helper_login_condition_exception')}</li>
          </ul>
        </OdsText>
      </form>
    </Modal>
  );
}
