import {
  Links,
  LinkType,
  Price,
  useNotifications,
  OvhSubsidiary,
  IntervalUnitType,
} from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsText,
  OsdsButton,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsQuantity,
  OsdsInput,
  OsdsIcon,
  OsdsFormField,
  OsdsRadioGroup,
  OsdsRadio,
  OsdsRadioButton,
  OsdsLink,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_LINK_REFERRER_POLICY,
  ODS_RADIO_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import Loading from '@/components/Loading/Loading';
import { useOrderCatalog } from '@/hooks/useOrderCatalog';
import {
  order,
  ZimbraPlanCodes,
  generateOrderURL,
  whitelistedPlanCodes,
} from '@/api/order';
import {
  checkValidityField,
  checkValidityForm,
  FormTypeInterface,
} from '@/utils';
import { usePlatform } from '@/hooks';

type OrderGeneratedTileProps = {
  orderURL: string;
};

function OrderGeneratedTile({ orderURL }: Readonly<OrderGeneratedTileProps>) {
  const { t } = useTranslation('accounts/order');
  const navigate = useNavigate();
  const goBack = () => {
    navigate('..');
  };

  return (
    <>
      <OsdsTile data-testid="order-generated-tile" className="mb-6">
        <span slot="start">
          <div className="flex flex-col gap-6 mb-6">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._600}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('zimbra_account_order_initiated_title')}
            </OsdsText>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._800}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('zimbra_account_order_initiated_subtitle')}
            </OsdsText>
            <OsdsLink
              className="break-all"
              color={ODS_THEME_COLOR_INTENT.primary}
              target={OdsHTMLAnchorElementTarget._blank}
              referrerpolicy={
                ODS_LINK_REFERRER_POLICY.strictOriginWhenCrossOrigin
              }
              href={orderURL}
            >
              {orderURL}
              <span slot="end">
                <OsdsIcon
                  className="ml-4 cursor-pointer"
                  name={ODS_ICON_NAME.EXTERNAL_LINK}
                  size={ODS_ICON_SIZE.xs}
                  hoverable
                ></OsdsIcon>
              </span>
            </OsdsLink>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._800}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('zimbra_account_order_initiated_info')}
            </OsdsText>
          </div>
        </span>
      </OsdsTile>
      <OsdsButton
        inline
        size={ODS_BUTTON_SIZE.md}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={goBack}
      >
        {t('zimbra_account_order_cta_done')}
      </OsdsButton>
    </>
  );
}

type OrderCatalogFormProps = {
  catalog: order.publicOrder.Catalog;
  locale: string;
  orderBaseURL: string;
};

function OrderCatalogForm({
  catalog,
  locale,
  orderBaseURL,
}: Readonly<OrderCatalogFormProps>) {
  const { t } = useTranslation('accounts/order');
  const { platformId } = usePlatform();
  const [orderURL, setOrderURL] = useState('');
  const plans = useMemo(() => {
    return (catalog?.plans || [])
      .filter((plan) =>
        whitelistedPlanCodes.includes(plan.planCode as ZimbraPlanCodes),
      )
      .map((plan) => {
        return {
          ...plan,
          monthly: plan.pricings.find(
            (pricing) =>
              pricing.interval === 1 &&
              pricing.intervalUnit === IntervalUnitType.month,
          ),
        };
      });
  }, [catalog]);

  const [isFormValid, setIsFormValid] = useState(false);
  const [form, setForm] = useState<FormTypeInterface>({
    consent: {
      value: '',
      touched: false,
      required: true,
      validate: /checked/,
    },
    commitment: {
      value: '1',
      touched: false,
      required: true,
    },
    ...plans.reduce<FormTypeInterface>((prev, curr) => {
      return {
        ...prev,
        [curr.planCode]: {
          value: '0',
          required: false,
          touched: false,
          validate: (value) => Number(value) >= 0,
        },
      };
    }, {}),
  });

  const handleFormChange = (name: string, value: string) => {
    const newForm: FormTypeInterface = form;
    newForm[name] = {
      required: true,
      ...form[name],
      value,
      touched: true,
      hasError: !checkValidityField(name, value, form),
    };
    const atLeastOneProductSelected = Object.entries(newForm)
      .filter(([key]) => whitelistedPlanCodes.includes(key as ZimbraPlanCodes))
      .some(([, item]) => Number(item.value) > 0);
    setForm((oldForm) => ({ ...oldForm, ...newForm }));
    setIsFormValid(checkValidityForm(form) && atLeastOneProductSelected);
  };

  const handleConfirm = () => {
    const products = Object.entries(form)
      .filter(([key]) => whitelistedPlanCodes.includes(key as ZimbraPlanCodes))
      .map(([key, { value }]) => {
        return {
          planCode: key,
          quantity: Number(value) || 1,
          platformId,
        };
      });
    setOrderURL(generateOrderURL({ baseURL: orderBaseURL, products }));
  };

  useEffect(() => {
    if (orderURL) {
      window.open(orderURL, '_blank', 'noopener,noreferrer');
    }
  }, [orderURL]);

  if (!catalog) {
    return <></>;
  }

  if (orderURL) {
    return <OrderGeneratedTile orderURL={orderURL} />;
  }

  return (
    <div className="flex flex-col gap-6 mt-4">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        hue={ODS_THEME_COLOR_HUE._800}
      >
        {t('zimbra_account_order_subtitle')}
      </OsdsText>
      {plans.flatMap(({ planCode, blobs, monthly }, index) => {
        const quantity = Number(form[planCode].value);
        return (
          <div className="flex flex-col gap-4" key={index}>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            >
              {blobs?.commercial?.name}
            </OsdsText>
            <OsdsQuantity>
              <OsdsButton
                slot="minus"
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_BUTTON_SIZE.sm}
                data-testid="quantity-minus"
              >
                <OsdsIcon
                  size={ODS_ICON_SIZE.sm}
                  name={ODS_ICON_NAME.MINUS}
                  contrasted
                ></OsdsIcon>
              </OsdsButton>
              <OsdsInput
                id={planCode}
                name={planCode}
                type={ODS_INPUT_TYPE.number}
                color={ODS_THEME_COLOR_INTENT.primary}
                min={0}
                max={1000}
                value={quantity || 0}
                onOdsValueChange={({ detail }) => {
                  const { name, value } = detail;
                  handleFormChange(name, value);
                }}
              />
              <OsdsButton
                slot="plus"
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_BUTTON_SIZE.sm}
                data-testid="quantity-plus"
              >
                <OsdsIcon
                  size={ODS_ICON_SIZE.sm}
                  name={ODS_ICON_NAME.PLUS}
                  contrasted
                ></OsdsIcon>
              </OsdsButton>
            </OsdsQuantity>
            <Price
              value={quantity ? quantity * monthly.price : monthly.price}
              tax={quantity ? quantity * monthly.tax : monthly.tax}
              intervalUnit={monthly.intervalUnit}
              ovhSubsidiary={catalog.locale.subsidiary}
              locale={locale}
            ></Price>
          </div>
        );
      })}
      <div className="flex flex-col gap-6">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          hue={ODS_THEME_COLOR_HUE._800}
        >
          {t('zimbra_account_order_subtitle_commitment')}
        </OsdsText>
        <OsdsFormField>
          <OsdsRadioGroup
            value={form.commitment.value as string}
            data-testid="radio-group-commitment"
          >
            <OsdsRadio value="1">
              <OsdsRadioButton
                className="items-start"
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_RADIO_BUTTON_SIZE.xs}
              >
                <span slot="end">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  >
                    {`1 ${t('zimbra_account_order_commitment_month')}`}
                  </OsdsText>
                </span>
              </OsdsRadioButton>
            </OsdsRadio>
            <OsdsRadio disabled={true} value="12">
              <OsdsRadioButton
                className="items-start"
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_RADIO_BUTTON_SIZE.xs}
                disabled={true}
              >
                <span slot="end">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  >
                    {`12 ${t('zimbra_account_order_commitment_months')}`}
                  </OsdsText>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  >
                    {t('zimbra_account_order_commitment_available_soon')}
                  </OsdsText>
                </span>
              </OsdsRadioButton>
            </OsdsRadio>
          </OsdsRadioGroup>
        </OsdsFormField>
      </div>
      <OsdsFormField>
        <OsdsCheckbox
          key="consent"
          checked={form.consent.value === 'checked'}
          name="consent"
          onOdsCheckedChange={() =>
            handleFormChange(
              'consent',
              form.consent.value === 'checked' ? '' : 'checked',
            )
          }
        >
          <OsdsCheckboxButton
            className="flex items-start"
            size={ODS_CHECKBOX_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            data-testid="checkbox-consent"
          >
            <span slot="end">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              >
                {t('zimbra_account_order_legal_checkbox')}
              </OsdsText>
            </span>
          </OsdsCheckboxButton>
        </OsdsCheckbox>
      </OsdsFormField>
      <OsdsButton
        className="w-fit"
        color={ODS_THEME_COLOR_INTENT.primary}
        inline
        size={ODS_BUTTON_SIZE.sm}
        disabled={!isFormValid ? true : null}
        onClick={handleConfirm}
        data-testid="order-account-confirm-btn"
      >
        {t('zimbra_account_order_cta_confirm')}
      </OsdsButton>
    </div>
  );
}

export default function EmailAccountsOrder() {
  const { addError } = useNotifications();
  const { t } = useTranslation('accounts/order');
  const context = useContext(ShellContext);
  const locale = context.environment.getUserLocale();
  const ovhSubsidiary = context.environment.getUser()
    .ovhSubsidiary as OvhSubsidiary;
  const region = context.environment.getRegion();
  const orderBaseURL = getExpressOrderURL(region, ovhSubsidiary);

  const navigate = useNavigate();

  const goBack = () => {
    navigate('..');
  };

  const { data: catalog, isLoading, isError, error } = useOrderCatalog({
    productName: 'zimbra',
    ovhSubsidiary,
  });

  useEffect(() => {
    if (isError && error) {
      addError(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_account_order_no_product_error_message')}
        </OsdsText>,
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
      />
      <OsdsText
        data-testid="page-title"
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        hue={ODS_THEME_COLOR_HUE._800}
      >
        {t('zimbra_account_order_title')}
      </OsdsText>
      {isLoading ? (
        <Loading />
      ) : (
        <OrderCatalogForm
          catalog={catalog}
          locale={locale}
          orderBaseURL={orderBaseURL}
        />
      )}
    </div>
  );
}
