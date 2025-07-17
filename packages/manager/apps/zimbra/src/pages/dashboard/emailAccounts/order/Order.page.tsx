import {
  Links,
  LinkType,
  Price,
  useNotifications,
  OvhSubsidiary,
  IntervalUnitType,
  IconLinkAlignmentType,
  Order,
} from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OdsText,
  OdsCheckbox,
  OdsQuantity,
  OdsFormField,
  OdsRadio,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loading } from '@/components';
import { useOrderCatalog, usePlatform } from '@/data/hooks';
import { order, ZimbraPlanCodes, generateOrderURL } from '@/data/api';
import { useGenerateUrl } from '@/hooks';
import {
  CANCEL,
  CONFIRM,
  ORDER_ZIMBRA_EMAIL_ACCOUNT,
} from '@/tracking.constants';
import { orderEmailAccountSchema } from '@/utils';

type OrderCatalogFormProps = {
  catalog: order.publicOrder.Catalog;
  locale: string;
  orderBaseURL: string;
  goBack: () => void;
};

const OrderCatalogForm = ({
  catalog,
  locale,
  orderBaseURL,
  goBack,
}: Readonly<OrderCatalogFormProps>) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['accounts/order', 'common']);
  const { platformId } = usePlatform();
  const [orderURL, setOrderURL] = useState('');
  const starterPlan = useMemo(() => {
    const starter = (catalog?.plans || []).find(
      (plan) => plan.planCode === ZimbraPlanCodes.ZIMBRA_STARTER,
    );

    if (!starter) {
      return null;
    }

    return {
      ...starter,
      monthly: starter.pricings.find(
        (pricing) =>
          pricing.interval === 1 &&
          pricing.intervalUnit === IntervalUnitType.month,
      ),
    };
  }, [catalog]);

  const {
    control,
    getValues,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      consent: false,
      commitment: '1',
      [ZimbraPlanCodes.ZIMBRA_STARTER as string]: 0,
    },
    mode: 'onTouched',
    resolver: zodResolver(orderEmailAccountSchema),
  });

  const handleConfirmClick = () => {
    const data = getValues();
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ORDER_ZIMBRA_EMAIL_ACCOUNT, CONFIRM, data.commitment],
    });

    const products = [
      {
        planCode: ZimbraPlanCodes.ZIMBRA_STARTER,
        quantity: data[ZimbraPlanCodes.ZIMBRA_STARTER] || 0,
        platformId,
      },
    ];

    const expressOrderURL = generateOrderURL({
      baseURL: orderBaseURL,
      products,
    });

    setOrderURL(expressOrderURL);
  };

  if (!catalog) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <Order>
        {orderURL ? (
          <Order.Summary
            productName={t('zimbra_account_service_name')}
            orderLink={orderURL}
            onFinish={goBack}
          />
        ) : (
          <Order.Configuration
            onConfirm={handleConfirmClick}
            onCancel={goBack}
            isValid={isDirty && isValid}
          >
            <OdsText preset={ODS_TEXT_PRESET.heading4}>
              {t('zimbra_account_order_subtitle')}
            </OdsText>
            <Controller
              control={control}
              name={ZimbraPlanCodes.ZIMBRA_STARTER}
              render={({ field: { name, value, onChange, onBlur } }) => (
                <OdsFormField
                  className="flex flex-col gap-4"
                  error={errors?.[name]?.message}
                >
                  <OdsText
                    className="font-bold"
                    preset={ODS_TEXT_PRESET.paragraph}
                  >
                    {starterPlan?.blobs?.commercial?.name}
                  </OdsText>
                  <OdsQuantity
                    id={name}
                    name={name}
                    className="justify-start"
                    min={0}
                    max={1000}
                    value={value}
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                  ></OdsQuantity>
                  <Price
                    value={
                      value
                        ? value * starterPlan?.monthly.price
                        : starterPlan?.monthly.price
                    }
                    tax={
                      value
                        ? value * starterPlan?.monthly.tax
                        : starterPlan?.monthly.tax
                    }
                    intervalUnit={starterPlan?.monthly.intervalUnit}
                    ovhSubsidiary={catalog.locale.subsidiary}
                    locale={locale}
                  ></Price>
                </OdsFormField>
              )}
            />
            <Controller
              control={control}
              name="commitment"
              render={({ field: { name, value, onChange } }) => (
                <OdsFormField error={errors?.[name]?.message}>
                  <label htmlFor={name} slot="label">
                    <OdsText preset={ODS_TEXT_PRESET.heading4}>
                      {t('zimbra_account_order_subtitle_commitment')}
                    </OdsText>
                  </label>
                  <div className="flex flex-col gap-4">
                    <div className="flex leading-none gap-4">
                      <OdsRadio
                        id="1-month"
                        name="1-month"
                        data-testid="radio-1-month"
                        value="1"
                        isChecked={value === '1'}
                        onClick={() => onChange('1')}
                      ></OdsRadio>
                      <label htmlFor="1-month" className="cursor-pointer">
                        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                          {`1 ${t('zimbra_account_order_commitment_month')}`}
                        </OdsText>
                      </label>
                    </div>
                    <div className="flex leading-none gap-4">
                      <OdsRadio
                        id="12-month"
                        name="12-month"
                        data-testid="radio-12-month"
                        value="12"
                        isDisabled
                        isChecked={value === '12'}
                        onClick={() => onChange('12')}
                      ></OdsRadio>
                      <label
                        htmlFor="12-month"
                        className="flex flex-col cursor-pointer"
                      >
                        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                          {`12 ${t('zimbra_account_order_commitment_months')}`}
                        </OdsText>
                        <OdsText preset={ODS_TEXT_PRESET.caption}>
                          {t('zimbra_account_order_commitment_available_soon')}
                        </OdsText>
                      </label>
                    </div>
                  </div>
                </OdsFormField>
              )}
            />
            <Controller
              control={control}
              name="consent"
              render={({ field: { name, value, onChange } }) => (
                <OdsFormField error={errors?.[name]?.message}>
                  <div className="flex leading-none gap-4 cursor-pointer">
                    <OdsCheckbox
                      data-testid={name}
                      inputId={name}
                      id={name}
                      name={name}
                      value={(value as unknown) as string}
                      isChecked={value}
                      onClick={() => onChange(!value)}
                    ></OdsCheckbox>
                    <label className="cursor-pointer" htmlFor={name}>
                      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                        <Trans
                          t={t}
                          i18nKey={'zimbra_account_order_legal_checkbox'}
                        />
                      </OdsText>
                    </label>
                  </div>
                </OdsFormField>
              )}
            />
          </Order.Configuration>
        )}
      </Order>
    </div>
  );
};

export const EmailAccountsOrder = () => {
  const { trackClick } = useOvhTracking();
  const { addError } = useNotifications();
  const { t } = useTranslation('accounts/order');
  const context = useContext(ShellContext);
  const locale = context.environment.getUserLocale();
  const ovhSubsidiary = context.environment.getUser()
    .ovhSubsidiary as OvhSubsidiary;
  const region = context.environment.getRegion();
  const orderBaseURL = getExpressOrderURL(region, ovhSubsidiary);

  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');

  const goBack = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ORDER_ZIMBRA_EMAIL_ACCOUNT, CANCEL],
    });
    navigate(goBackUrl);
  };

  const { data: catalog, isLoading, isError, error } = useOrderCatalog({
    productName: 'zimbra',
    ovhSubsidiary,
  });

  useEffect(() => {
    if (isError && error) {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_order_no_product_error_message')}
        </OdsText>,
        true,
      );
    }
  }, [isError, error]);

  return (
    <div className="flex flex-col items-start space-y-4 mb-5 w-full md:w-3/4">
      <Links
        type={LinkType.back}
        onClickReturn={goBack}
        label={t('zimbra_account_order_cta_back')}
        iconAlignment={IconLinkAlignmentType.left}
      />
      <OdsText
        data-testid="page-title"
        preset={ODS_TEXT_PRESET.heading2}
        className="mb-6"
      >
        {t('zimbra_account_order_title')}
      </OdsText>
      {isLoading ? (
        <Loading />
      ) : (
        <OrderCatalogForm
          catalog={catalog}
          locale={locale}
          orderBaseURL={orderBaseURL}
          goBack={goBack}
        />
      )}
    </div>
  );
};

export default EmailAccountsOrder;
