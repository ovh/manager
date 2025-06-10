import { useContext } from 'react';
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
  ODS_MODAL_COLOR,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  IntervalUnitType,
  Modal,
  OvhSubsidiary,
  Price,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGenerateUrl } from '@/hooks';
import {
  getOfficeUserDomainQueryKey,
  getOfficeUsersDomain,
  postOrderUsers,
} from '@/data/api/users';
import { getOfficePrice, getOfficePriceQueryKey } from '@/data/api/price';
import { OfficeUserEnum } from '@/data/api/order/type';
import { UserOrderParamsType } from '@/data/api/api.type';
import { POST_USERS_FORM_SCHEMA } from '@/utils/formSchemas.utils';

export default function ModalOrderUsers() {
  const { t } = useTranslation(['dashboard/users/order-users', 'common']);
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);
  const { serviceName } = useParams();
  const { environment } = useContext(ShellContext);
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
    formState: { isValid, isDirty, errors },
  } = useForm({
    defaultValues: {
      licence: '',
      login: '',
      domain: '',
      firstName: '',
      lastName: '',
      usageLocation: ovhSubsidiary,
    },
    mode: 'onBlur',
    resolver: zodResolver(POST_USERS_FORM_SCHEMA),
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
      heading={t('common:users_order_users')}
      type={ODS_MODAL_COLOR.information}
      isOpen={true}
      secondaryLabel={t('common:cta_cancel')}
      onSecondaryButtonClick={handleCancelClick}
      onDismiss={handleCancelClick}
      primaryLabel={t('common:cta_confirm')}
      isPrimaryButtonDisabled={!isDirty || !isValid}
      onPrimaryButtonClick={handleSubmit(handleSaveClick)}
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
            name="firstName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <OdsFormField
                error={errors?.firstName?.message as string}
                className="w-full"
              >
                <label slot="label">{t('common:firstname')}*</label>
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name="firstName"
                  data-testid="input-firstName"
                  onOdsChange={(event) => field.onChange(event.target.value)}
                />
              </OdsFormField>
            )}
          />
          <Controller
            name="lastName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <OdsFormField
                error={errors?.lastName?.message as string}
                className="w-full"
              >
                <label slot="label">{t('common:lastname')}*</label>
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name="lastName"
                  data-testid="input-lastName"
                  onOdsChange={(event) => field.onChange(event.target.value)}
                />
              </OdsFormField>
            )}
          />
        </div>
        <OdsFormField error={errors?.login?.message as string}>
          <label slot="label">{t('common:login')}*</label>
          <div className="flex flex-wrap sm:flex-nowrap gap-5">
            <Controller
              name="login"
              control={control}
              rules={{ required: true }}
              render={({ field: { name, value, onBlur, onChange } }) => (
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid="input-login"
                  onOdsBlur={onBlur}
                  onOdsChange={onChange}
                  className="w-full"
                />
              )}
            />
            <Controller
              name="domain"
              control={control}
              render={({ field: { name } }) => (
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name={name}
                  data-testid="input-domain"
                  isDisabled
                  value={`@${domain}`}
                  className="w-full"
                />
              )}
            />
          </div>
        </OdsFormField>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <ul className="mt-0">
            <li>{t('common:form_helper_login_conditions')}</li>
            <li>{t('common:form_helper_login_condition_exception')}</li>
          </ul>
        </OdsText>
        <div className="flex w-full">
          <OdsFormField className="w-full">
            <label slot="label">{t('dashboard_users_order_users_type')}*</label>
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
      </form>
    </Modal>
  );
}
