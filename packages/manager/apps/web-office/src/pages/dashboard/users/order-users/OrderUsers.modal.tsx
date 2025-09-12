import { useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_INPUT_TYPE, ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { ApiError } from '@ovh-ux/manager-core-api';
import {
  IntervalUnitType,
  Modal,
  OvhSubsidiary,
  Price,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { CANCEL, CONFIRM, ORDER_ACCOUNT } from '@/Tracking.constants';
import { UserOrderParamsType } from '@/data/api/ApiType';
import { OfficeUserEnum } from '@/data/api/order/type';
import { getOfficePrice } from '@/data/api/price/api';
import { getOfficePriceQueryKey } from '@/data/api/price/key';
import { getOfficeUsersDomain, postOrderUsers } from '@/data/api/users/api';
import { getOfficeUserDomainQueryKey } from '@/data/api/users/key';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';
import { zForm } from '@/utils/FormSchemas.utils';

export default function ModalOrderUsers() {
  const { t } = useTranslation([
    'dashboard/users/order-users',
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.DASHBOARD,
    NAMESPACES.FORM,
  ]);
  const { trackClick } = useOvhTracking();
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

  const tracking = (action: string, productType?: string) =>
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ORDER_ACCOUNT, productType ? `${action}_${productType}` : action],
    });

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
    resolver: zodResolver(zForm(t).POST_USERS_FORM_SCHEMA),
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
    mutationFn: (params: UserOrderParamsType) => postOrderUsers(serviceName, params),
    onSuccess: () => {
      addSuccess(<OdsText>{t('dashboard_users_order_users_message_success')}</OdsText>, true);
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
    licence: OfficeUserEnum;
    login: string;
    domain: string;
    firstName: string;
    lastName: string;
    usageLocation: string;
  }> = ({ firstName, lastName, login, licence }) => {
    const selectedOffer = offerOptions.find((option) => option.value === licence);
    tracking(CONFIRM, selectedOffer.value);
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
    tracking(CANCEL);
    onClose();
  };

  return (
    <Modal
      heading={t(`${NAMESPACES.ACTIONS}:order_users`)}
      type={ODS_MODAL_COLOR.information}
      isOpen={true}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
      onDismiss={handleCancelClick}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      isPrimaryButtonDisabled={!isDirty || !isValid}
      onPrimaryButtonClick={() => void handleSubmit(handleSaveClick)()}
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
            name="firstName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <OdsFormField error={errors?.firstName?.message} className="w-full">
                <label slot="label">{t(`${NAMESPACES.FORM}:firstname`)}*</label>
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
              <OdsFormField error={errors?.lastName?.message} className="w-full">
                <label slot="label">{t(`${NAMESPACES.FORM}:lastname`)}*</label>
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
        <OdsFormField error={errors?.login?.message}>
          <label slot="label">{t(`${NAMESPACES.FORM}:login`)}*</label>
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
            <label slot="label">{t(`${NAMESPACES.DASHBOARD}:licence_type`)}*</label>
            <Controller
              name="licence"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <OdsSelect
                  name="licence"
                  placeholder={t(`${NAMESPACES.ACTIONS}:select`)}
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
            <label slot="label">{t(`${NAMESPACES.FORM}:price`)}</label>
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
