import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGenerateUrl } from '@/hooks';
import { useUserDetail } from '@/data/hooks';
import queryClient from '@/queryClient';
import { EDIT_USERS_FORM_SCHEMA } from '@/utils/formSchemas.utils';
import {
  getOfficeLicenseQueryKey,
  putOfficeLicenseDetails,
} from '@/data/api/license';
import {
  getOfficeUserDomainQueryKey,
  getOfficeUsersDomain,
  getOfficeUsersQueryKey,
  putOfficeUserDetail,
} from '@/data/api/users';
import { UserParamsType } from '@/data/api/api.type';

export default function ModalEditUsers() {
  const { t } = useTranslation(['dashboard/users/edit', 'common']);
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
      heading={t('dashboard_users_edit_title')}
      type={ODS_MODAL_COLOR.information}
      isOpen={true}
      isLoading={isLoading}
      secondaryLabel={t('common:cta_cancel')}
      onSecondaryButtonClick={handleCancelClick}
      onDismiss={handleCancelClick}
      primaryLabel={t('common:cta_confirm')}
      isPrimaryButtonDisabled={!isDirty || !isValid}
      onPrimaryButtonClick={handleSubmit(handleSaveClick)}
      isPrimaryButtonLoading={isSending}
    >
      <form
        className="flex flex-col text-left gap-y-5"
        onSubmit={handleSubmit(handleSaveClick)}
      >
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:common_field_label_mandatory')}
        </OdsText>
        <div className="flex flex-wrap sm:flex-nowrap gap-5">
          <Controller
            control={control}
            name="firstname"
            rules={{ required: true }}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <OdsFormField
                error={errors?.firstname?.message as string}
                className="w-full"
              >
                <label slot="label">{t('common:firstname')}*</label>

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
              <OdsFormField
                error={errors?.lastname?.message as string}
                className="w-full"
              >
                <label slot="label">{t('common:lastname')}*</label>

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
            <OdsFormField error={errors?.login?.message as string}>
              <label htmlFor="label" slot="label">
                {t('common:login')}*
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
                  value={`@${userDetail.activationEmail.split('@')[1] ||
                    domain}`}
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
