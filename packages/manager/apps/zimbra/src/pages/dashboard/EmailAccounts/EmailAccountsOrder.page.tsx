import {
  Links,
  LinkType,
  Price,
  useNotifications,
  OvhSubsidiary,
  IntervalUnitType,
  IconLinkAlignmentType,
} from '@ovh-ux/manager-react-components';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OdsText,
  OdsButton,
  OdsCheckbox,
  OdsQuantity,
  OdsFormField,
  OdsRadio,
  OdsLink,
  OdsCard,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_CARD_COLOR,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import Loading from '@/components/Loading/Loading';
import { useOrderCatalog } from '@/hooks/useOrderCatalog';
import {
  order,
  ZimbraPlanCodes,
  generateOrderURL,
  whitelistedPlanCodes,
} from '@/api/order';
import { usePlatform } from '@/hooks';
import {
  CANCEL,
  CONFIRM,
  ORDER_ZIMBRA_EMAIL_ACCOUNT,
} from '@/tracking.constant';
import { FormTypeInterface, useForm } from '@/hooks/useForm';

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
      <OdsCard
        data-testid="order-generated-tile"
        color={ODS_CARD_COLOR.neutral}
        className="mb-6"
      >
        <div className="flex flex-col gap-6 p-6">
          <OdsText preset={ODS_TEXT_PRESET.heading3}>
            {t('zimbra_account_order_initiated_title')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('zimbra_account_order_initiated_subtitle')}
          </OdsText>
          <OdsLink
            target="_blank"
            referrerpolicy="strict-origin-when-cross-origin"
            href={orderURL}
            icon={ODS_ICON_NAME.externalLink}
            label={t('zimbra_account_order_initiated_link_label')}
          ></OdsLink>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('zimbra_account_order_initiated_info')}
          </OdsText>
        </div>
      </OdsCard>
      <OdsButton
        label={t('zimbra_account_order_cta_done')}
        size={ODS_BUTTON_SIZE.md}
        color={ODS_BUTTON_COLOR.primary}
        onClick={goBack}
      ></OdsButton>
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
  const { trackClick } = useOvhTracking();
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

  const { form, isFormValid, setValue } = useForm({
    consent: {
      value: '',
      required: true,
      validate: /checked/,
    },
    commitment: {
      value: '1',
      required: true,
    },
    ...plans.reduce<FormTypeInterface>((prev, curr) => {
      return {
        ...prev,
        [curr.planCode]: {
          value: '0',
          validate: (value) => Number(value) >= 0 && Number(value) <= 1000,
        },
      };
    }, {}),
  });

  const atLeastOneProductSelected = Object.entries(form)
    .filter(([key]) => whitelistedPlanCodes.includes(key as ZimbraPlanCodes))
    .some(([, item]) => Number(item.value) > 0);

  const handleConfirm = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ORDER_ZIMBRA_EMAIL_ACCOUNT, CONFIRM, form.commitment.value],
    });
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
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('zimbra_account_order_subtitle')}
      </OdsText>
      {plans.flatMap(({ planCode, blobs, monthly }) => {
        const quantity = Number(form[planCode].value);
        return (
          <div className="flex flex-col gap-4" key={planCode}>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {blobs?.commercial?.name}
            </OdsText>
            <OdsQuantity
              id={planCode}
              name={planCode}
              className="justify-start"
              min={0}
              max={1000}
              value={quantity || 0}
              onOdsChange={({ detail }) => {
                const { name, value } = detail;
                setValue(name, value.toString());
              }}
            ></OdsQuantity>
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
        <OdsText preset={ODS_TEXT_PRESET.heading3}>
          {t('zimbra_account_order_subtitle_commitment')}
        </OdsText>
        <OdsFormField>
          <div className="flex leading-none gap-4">
            <OdsRadio
              id="1-month"
              name="1-month"
              data-testid="radio-1-month"
              value="1"
              isChecked={form.commitment.value === '1'}
              onOdsChange={(event) =>
                setValue('commitment', event.detail.value)
              }
            ></OdsRadio>
            <label htmlFor="1-month" className="flex flex-col w-full">
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
              isChecked={form.commitment.value === '12'}
              isDisabled={true}
              onOdsChange={(event) =>
                setValue('commitment', event.detail.value)
              }
            ></OdsRadio>
            <label htmlFor="12-month" className="flex flex-col w-full">
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {`12 ${t('zimbra_account_order_commitment_months')}`}
              </OdsText>
              <OdsText preset={ODS_TEXT_PRESET.caption}>
                {t('zimbra_account_order_commitment_available_soon')}
              </OdsText>
            </label>
          </div>
        </OdsFormField>
      </div>
      <OdsFormField>
        <div className="flex leading-none gap-4">
          <OdsCheckbox
            id="consent"
            name="consent"
            data-testid="consent"
            isChecked={form.consent.value === 'checked'}
            onOdsChange={() =>
              setValue(
                'consent',
                form.consent.value === 'checked' ? '' : 'checked',
              )
            }
          ></OdsCheckbox>
          <label htmlFor="consent">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_account_order_legal_checkbox')}
            </OdsText>
          </label>
        </div>
      </OdsFormField>
      <OdsButton
        className="w-fit"
        color={ODS_BUTTON_COLOR.primary}
        isDisabled={!isFormValid || !atLeastOneProductSelected}
        onClick={handleConfirm}
        data-testid="order-account-confirm-btn"
        label={t('zimbra_account_order_cta_confirm')}
      ></OdsButton>
    </div>
  );
}

export default function EmailAccountsOrder() {
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

  const goBack = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ORDER_ZIMBRA_EMAIL_ACCOUNT, CANCEL],
    });
    navigate('..');
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
      <OdsText data-testid="page-title" preset={ODS_TEXT_PRESET.heading2}>
        {t('zimbra_account_order_title')}
      </OdsText>
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
