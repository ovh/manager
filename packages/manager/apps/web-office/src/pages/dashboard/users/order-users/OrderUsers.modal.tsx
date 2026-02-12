import { useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Input,
  MODAL_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  Select,
  SelectContent,
  SelectControl,
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
import { IntervalUnit, Modal, OvhSubsidiary, Price, useNotifications } from '@ovh-ux/muk';

import { CANCEL, CONFIRM, ORDER_ACCOUNT } from '@/Tracking.constants';
import { UserOrderParamsType } from '@/data/api/ApiType';
import { OfficeUserEnum } from '@/data/api/order/type';
import { getOfficePrice } from '@/data/api/price/api';
import { getOfficePriceQueryKey } from '@/data/api/price/key';
import { getOfficeUsersDomain, postOrderUsers } from '@/data/api/users/api';
import { getOfficeUserDomainQueryKey } from '@/data/api/users/key';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';
import { zForm } from '@/utils/FormSchemas.utils';

import { offerOptions } from './OrderUsers.constants';

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
      addSuccess(<Text>{t('dashboard_users_order_users_message_success')}</Text>, true);
    },
    onError: (error: ApiError) => {
      addError(
        <Text>
          {t('dashboard_users_order_users_message_error', {
            error: error?.response?.data?.message,
          })}
        </Text>,
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
    tracking(CONFIRM, licence);
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
      type={MODAL_COLOR.information}
      open={true}
      onOpenChange={handleCancelClick}
      secondaryButton={{ label: t(`${NAMESPACES.ACTIONS}:cancel`), onClick: handleCancelClick }}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        disabled: !isDirty || !isValid,
        onClick: () => void handleSubmit(handleSaveClick)(),
      }}
    >
      <form
        className="flex flex-col gap-y-5 text-left"
        onSubmit={(e) => void handleSubmit(handleSaveClick)(e)}
      >
        <div className="flex flex-wrap gap-5 sm:flex-nowrap">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, name } }) => (
              <FormField invalid={!!errors?.firstName?.message} className="w-full">
                <FormFieldLabel>
                  {t(`${NAMESPACES.FORM}:firstname`)} - {t(`${NAMESPACES.FORM}:required`)}
                </FormFieldLabel>
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  data-testid="input-firstName"
                  onBlur={onBlur}
                  onChange={(event) => onChange(event.target.value)}
                />
                <FormFieldError>{errors?.firstName?.message}</FormFieldError>
              </FormField>
            )}
          />
          <Controller
            name="lastName"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, name } }) => (
              <FormField invalid={!!errors?.lastName?.message} className="w-full">
                <FormFieldLabel>
                  {t(`${NAMESPACES.FORM}:lastname`)} - {t(`${NAMESPACES.FORM}:required`)}
                </FormFieldLabel>
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  data-testid="input-lastName"
                  onBlur={onBlur}
                  onChange={(event) => onChange(event.target.value)}
                />
                <FormFieldError>{errors?.lastName?.message}</FormFieldError>
              </FormField>
            )}
          />
        </div>
        <FormField invalid={!!errors?.login?.message}>
          <FormFieldLabel>
            {t(`${NAMESPACES.FORM}:login`)} - {t(`${NAMESPACES.FORM}:required`)}
          </FormFieldLabel>
          <div className="flex flex-wrap gap-5 sm:flex-nowrap">
            <Controller
              name="login"
              control={control}
              rules={{ required: true }}
              render={({ field: { name, value, onBlur, onChange } }) => (
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  value={value}
                  data-testid="input-login"
                  onBlur={onBlur}
                  onChange={onChange}
                  className="w-full"
                />
              )}
            />
            <Controller
              name="domain"
              control={control}
              render={({ field: { name } }) => (
                <Input
                  type={INPUT_TYPE.text}
                  name={name}
                  data-testid="input-domain"
                  disabled
                  value={`@${domain}`}
                  className="w-full"
                />
              )}
            />
          </div>
          <FormFieldError>{errors?.login?.message}</FormFieldError>
        </FormField>
        <Text preset={TEXT_PRESET.paragraph}>
          <ul className="mt-0">
            <li>{t('common:form_helper_login_conditions')}</li>
            <li>{t('common:form_helper_login_condition_exception')}</li>
          </ul>
        </Text>
        <div className="flex w-full">
          <FormField className="w-full">
            <FormFieldLabel>
              {t(`${NAMESPACES.DASHBOARD}:licence_type`)} - {t(`${NAMESPACES.FORM}:required`)}
            </FormFieldLabel>
            <Controller
              name="licence"
              control={control}
              rules={{ required: true }}
              render={({ field: { name, onChange } }) => (
                <Select
                  name={name}
                  onValueChange={(event) => onChange(event.value[0])}
                  items={offerOptions}
                  data-testid="select-licence"
                >
                  <SelectControl placeholder={t(`${NAMESPACES.ACTIONS}:select`)} />
                  <SelectContent createPortal={false} />
                </Select>
              )}
            />
          </FormField>
        </div>
        {officePrice?.value && (
          <FormField className="w-full">
            <FormFieldLabel>{t(`${NAMESPACES.FORM}:price`)}</FormFieldLabel>
            <Price
              value={officePrice?.value}
              ovhSubsidiary={ovhSubsidiary as OvhSubsidiary}
              intervalUnit={IntervalUnit.month}
              locale={userLocale}
            ></Price>
          </FormField>
        )}
        <Message className="my-6" dismissible={false}>
          <MessageIcon name={ICON_NAME.circleInfo} />
          <MessageBody>{t('dashboard_users_order_users_message')}</MessageBody>
        </Message>
      </form>
    </Modal>
  );
}
