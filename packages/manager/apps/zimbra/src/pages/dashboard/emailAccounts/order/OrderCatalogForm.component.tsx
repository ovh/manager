import { useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import {
  Card,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  FormFieldError,
  FormFieldLabel,
  Quantity,
  QuantityControl,
  QuantityInput,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { IntervalUnit, Order, Price } from '@ovh-ux/muk';

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
          (pricing) => pricing.interval === 1 && pricing.intervalUnit === IntervalUnit.month,
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
            <Text preset={TEXT_PRESET.paragraph}>{t('zimbra_account_order_subtitle')}</Text>
            <div className="flex flex-col gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.planCode}
                  color="neutral"
                  className="flex max-w-3xl items-center justify-between p-6"
                >
                  <Text className="font-bold" preset={TEXT_PRESET.heading6}>
                    {plan?.invoiceName}
                  </Text>
                  <Controller
                    control={control}
                    name={
                      plan.planCode === (ZimbraPlanCodes.ZIMBRA_PRO as string)
                        ? ZimbraPlanCodes.ZIMBRA_PRO
                        : ZimbraPlanCodes.ZIMBRA_STARTER
                    }
                    render={({
                      field: { name, value, onChange, onBlur },
                      fieldState: { isDirty, isTouched },
                    }) => (
                      <FormField
                        className="flex flex-row items-center gap-4"
                        invalid={(isDirty || isTouched) && !!errors?.[name]}
                      >
                        <Price
                          value={value ? value * plan?.monthly.price : plan?.monthly.price}
                          tax={value ? value * plan?.monthly.tax : plan?.monthly.tax}
                          intervalUnit={plan?.monthly.intervalUnit}
                          ovhSubsidiary={catalog.locale.subsidiary}
                          locale={locale}
                        ></Price>
                        <Quantity
                          id={name}
                          name={name}
                          className="justify-start"
                          min={0}
                          max={1000}
                          value={String(value)}
                          onValueChange={({ valueAsNumber }) => onChange(valueAsNumber)}
                          onBlur={onBlur}
                        >
                          <QuantityControl>
                            <QuantityInput />
                          </QuantityControl>
                        </Quantity>
                        {(isDirty || isTouched) && errors?.[name]?.message && (
                          <FormFieldError>{errors[name].message}</FormFieldError>
                        )}
                      </FormField>
                    )}
                  />
                </Card>
              ))}
            </div>
            <Controller
              control={control}
              name="commitment"
              render={({
                field: { name, value, onChange },
                fieldState: { isDirty, isTouched },
              }) => (
                <FormField invalid={(isDirty || isTouched) && !!errors?.[name]}>
                  <FormFieldLabel htmlFor={name} slot="label">
                    <Text preset={TEXT_PRESET.heading4}>
                      {t('zimbra_account_order_subtitle_commitment')}
                    </Text>
                  </FormFieldLabel>
                  <RadioGroup value={value} onValueChange={onChange}>
                    <Radio id="1-month" data-testid="radio-1-month" value="1">
                      <RadioControl />
                      <RadioLabel>
                        <Text preset={TEXT_PRESET.paragraph}>
                          {`1 ${t('zimbra_account_order_commitment_month')}`}
                        </Text>
                      </RadioLabel>
                    </Radio>
                    <Radio id="12-month" data-testid="radio-12-month" value="12">
                      <RadioControl />
                      <RadioLabel>
                        <Text preset={TEXT_PRESET.paragraph}>
                          {`12 ${t('zimbra_account_order_commitment_months')}`}
                        </Text>
                        <Text preset={TEXT_PRESET.caption}>
                          {t('zimbra_account_order_commitment_available_soon')}
                        </Text>
                      </RadioLabel>
                    </Radio>
                  </RadioGroup>
                  {(isDirty || isTouched) && errors?.[name]?.message && (
                    <FormFieldError>{errors[name].message}</FormFieldError>
                  )}
                </FormField>
              )}
            />
            <Controller
              control={control}
              name="consent"
              render={({
                field: { name, value, onChange },
                fieldState: { isDirty, isTouched },
              }) => (
                <FormField invalid={(isDirty || isTouched) && !!errors?.[name]}>
                  <Checkbox
                    data-testid={name}
                    id={name}
                    name={name}
                    value={value as unknown as string}
                    checked={value}
                    onCheckedChange={({ checked }) => onChange(checked)}
                  >
                    <CheckboxControl />
                    <CheckboxLabel>
                      <Text preset={TEXT_PRESET.paragraph} className="max-w-3xl">
                        <Trans t={t} i18nKey={'zimbra_account_order_legal_checkbox'} />
                      </Text>
                    </CheckboxLabel>
                  </Checkbox>
                  {(isDirty || isTouched) && errors?.[name]?.message && (
                    <FormFieldError>{errors[name].message}</FormFieldError>
                  )}
                </FormField>
              )}
            />
          </Order.Configuration>
        )}
      </Order>
    </div>
  );
};

export default OrderCatalogForm;
