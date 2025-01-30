import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  IntervalUnitType,
  OvhSubsidiary,
  Price,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import Modal from '@/components/Modals/Modal';
import { useGenerateUrl } from '@/hooks';
import {
  getOfficeUserDomainQueryKey,
  getOfficeUsersDomain,
  postOrderUsers,
} from '@/api/users';
import { getOfficePrice, getOfficePriceQueryKey } from '@/api/price';
import { OfficeUserEnum } from '@/api/order/type';
import { UserOrderParamsType } from '@/api/api.type';

export default function ModalOrderUsers() {
  const { t } = useTranslation(['dashboard/users/order-users', 'common']);
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);
  const { serviceName } = useParams();
  const { environment } = React.useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const userLocale = environment.getUserLocale();
  const { addError, addSuccess } = useNotifications();

  const { data: domain } = useQuery({
    queryKey: [getOfficeUserDomainQueryKey(serviceName)],
    queryFn: () => getOfficeUsersDomain(serviceName),
  });

  const offerOptions = [
    { label: 'Office Business', value: OfficeUserEnum.OFFICE_365_BUSINESS },
    { label: 'Office Pro Plus', value: OfficeUserEnum.OFFICE_365_PRO_PLUS },
  ];

  const {
    handleSubmit,
    control,
    watch,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      licence: '',
      login: '',
      domain,
      firstName: '',
      lastName: '',
      usageLocation: ovhSubsidiary,
    },
    mode: 'onChange',
  });

  const selectedlicenseType = watch('licence');

  const { data: officePrice } = useQuery({
    queryKey: [getOfficePriceQueryKey(selectedlicenseType)],
    queryFn: async () => {
      const price = await getOfficePrice({ officeName: selectedlicenseType });
      return {
        ...price,
        value: price?.value ? Math.round(price.value * 1e8) : null,
      };
    },
    enabled: !!selectedlicenseType,
  });

  const { mutate: orderUsers } = useMutation({
    mutationFn: (params: UserOrderParamsType) =>
      postOrderUsers(serviceName, params),
    onSuccess: () => {
      addSuccess(
        <OdsText>{t('dashboard_users_order_users_message_success')}</OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText>
          {t('dashboard_users_order_users_message_error', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      onClose();
    },
  });

  const handleSaveClick: SubmitHandler<{
    licence: string;
    login: string;
    domain: string;
    firstName: string;
    lastName: string;
    usageLocation: string;
  }> = ({ firstName, lastName, login, licence }) => {
    const selectedOffer = offerOptions.find(
      (option) => option.value === licence,
    );
    orderUsers({
      firstName,
      lastName,
      login,
      usageLocation: ovhSubsidiary as OvhSubsidiary,
      domain,
      licence: selectedOffer.value,
    });
  };
  const handleCancelClick = () => {
    onClose();
  };
  return (
    <Modal
      title={t('common:users_order_users')}
      onClose={onClose}
      isDismissible
      isOpen
      secondaryButton={{
        label: t('common:cta_cancel'),
        action: handleCancelClick,
        testid: 'cancel-btn',
        variant: ODS_BUTTON_VARIANT.outline,
      }}
      primaryButton={{
        label: t('common:cta_confirm'),
        action: handleSubmit(handleSaveClick),
        testid: 'confirm-btn',
        isDisabled: !isValid,
      }}
    >
      <form
        className="flex flex-col text-left "
        onSubmit={handleSubmit(handleSaveClick)}
      >
        <Controller
          name="firstName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <OdsFormField>
              <label slot="label">
                {t('dashboard_users_order_users_firstname_label')}*
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                name="firstName"
                data-testid="input-firstName"
                onOdsChange={(event) => field.onChange(event.target.value)}
              ></OdsInput>
            </OdsFormField>
          )}
        />
        <Controller
          name="lastName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <OdsFormField>
              <label slot="label">
                {t('dashboard_users_order_users_lastname_label')}*
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                name="lastName"
                data-testid="input-lastName"
                onOdsChange={(event) => field.onChange(event.target.value)}
              ></OdsInput>
            </OdsFormField>
          )}
        />

        <OdsFormField className="w-full">
          <label slot="label">
            {t('dashboard_users_order_users_login_label')}*
          </label>
          <div className="flex">
            <Controller
              name="login"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <OdsInput
                  className="w-full mr-6"
                  type={ODS_INPUT_TYPE.text}
                  name="login"
                  data-testid="input-login"
                  onOdsChange={(event) => field.onChange(event.target.value)}
                ></OdsInput>
              )}
            />
            <Controller
              name="domain"
              control={control}
              render={() => (
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name="domain"
                  data-testid="input-domain"
                  isDisabled
                  value={`@${domain}`}
                  className="w-full"
                ></OdsInput>
              )}
            />
          </div>
        </OdsFormField>

        <div className="flex w-full">
          <OdsFormField className="w-full">
            <label slot="label">{t('dashboard_users_order_users_type')}</label>
            <Controller
              name="licence"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <OdsSelect
                  name="licence"
                  placeholder={t(
                    'dashboard_users_order_users_type_placeholder',
                  )}
                  data-testid="input-licence"
                  onOdsChange={(event) => field.onChange(event.target.value)}
                >
                  {offerOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </OdsSelect>
              )}
            />
          </OdsFormField>
        </div>
        {officePrice?.value && (
          <OdsFormField className="w-full">
            <label slot="label">{t('dashboard_users_order_users_price')}</label>
            <Price
              value={officePrice?.value}
              ovhSubsidiary={ovhSubsidiary as OvhSubsidiary}
              intervalUnit={IntervalUnitType.month}
              locale={userLocale}
            ></Price>
          </OdsFormField>
        )}
        <OdsMessage className="mt-6 mb-6" isDismissible={false}>
          {t('dashboard_users_order_users_message')}
        </OdsMessage>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t('common:common_field_label_mandatory')}
        </OdsText>
      </form>
    </Modal>
  );
}
