import { useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCard } from '@ovhcloud/ods-components/react';
import {
  OdsCheckbox,
  OdsFormField,
  OdsQuantity,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { IntervalUnitType, Order, Price } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { ZimbraPlanCodes, generateOrderURL, order } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { CONFIRM, ORDER_ZIMBRA_EMAIL_ACCOUNT } from '@/tracking.constants';
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

  const plans = useMemo(() => {
    return catalog?.plans?.map((plan) => {
      return {
        ...plan,
        monthly: plan?.pricings.find(
          (pricing) => pricing.interval === 1 && pricing.intervalUnit === IntervalUnitType.month,
        ),
      };
    });
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
      [ZimbraPlanCodes.ZIMBRA_PRO as string]: 0,
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

    const products = [];

    if (data[ZimbraPlanCodes.ZIMBRA_STARTER] > 0) {
      products.push({
        planCode: ZimbraPlanCodes.ZIMBRA_STARTER,
        quantity: data[ZimbraPlanCodes.ZIMBRA_STARTER],
        platformId,
      });
    }

    if (data[ZimbraPlanCodes.ZIMBRA_PRO] > 0) {
      products.push({
        planCode: ZimbraPlanCodes.ZIMBRA_PRO,
        quantity: data[ZimbraPlanCodes.ZIMBRA_PRO],
        platformId,
      });
    }

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
    <div className="mt-4 flex flex-col gap-4">
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
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_account_order_subtitle')}
            </OdsText>
            <div className="flex flex-col gap-6">
              {plans.map((plan) => (
                <OdsCard
                  key={plan.planCode}
                  color="neutral"
                  className="flex max-w-3xl items-center justify-between p-6"
                >
                  <OdsText className="font-bold" preset={ODS_TEXT_PRESET.heading6}>
                    {plan?.invoiceName}
                  </OdsText>
                  <Controller
                    control={control}
                    name={
                      plan.planCode === (ZimbraPlanCodes.ZIMBRA_PRO as string)
                        ? ZimbraPlanCodes.ZIMBRA_PRO
                        : ZimbraPlanCodes.ZIMBRA_STARTER
                    }
                    render={({ field: { name, value, onChange, onBlur } }) => (
                      <OdsFormField
                        className="flex flex-row items-center gap-4"
                        error={errors?.[name]?.message}
                      >
                        <Price
                          value={value ? value * plan?.monthly.price : plan?.monthly.price}
                          tax={value ? value * plan?.monthly.tax : plan?.monthly.tax}
                          intervalUnit={plan?.monthly.intervalUnit}
                          ovhSubsidiary={catalog.locale.subsidiary}
                          locale={locale}
                        ></Price>
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
                      </OdsFormField>
                    )}
                  />
                </OdsCard>
              ))}
            </div>
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
                    <div className="flex gap-4 leading-none">
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
                    <div className="flex gap-4 leading-none">
                      <OdsRadio
                        id="12-month"
                        name="12-month"
                        data-testid="radio-12-month"
                        value="12"
                        isDisabled
                        isChecked={value === '12'}
                        onClick={() => onChange('12')}
                      ></OdsRadio>
                      <label htmlFor="12-month" className="flex cursor-pointer flex-col">
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
                  <div className="flex cursor-pointer gap-4 leading-none">
                    <OdsCheckbox
                      data-testid={name}
                      inputId={name}
                      id={name}
                      name={name}
                      value={value as unknown as string}
                      isChecked={value}
                      onClick={() => onChange(!value)}
                    ></OdsCheckbox>
                    <label className="cursor-pointer" htmlFor={name}>
                      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="max-w-3xl">
                        <Trans t={t} i18nKey={'zimbra_account_order_legal_checkbox'} />
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

export default OrderCatalogForm;
