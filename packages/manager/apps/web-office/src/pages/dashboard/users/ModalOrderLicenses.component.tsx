import React, { useContext, useMemo } from 'react';
import {
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsQuantity,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@/components/Modals/Modal';
import {
  useGenerateUrl,
  useOfficeLicenseDetail,
  useOrderCatalog,
} from '@/hooks';
import { generateOrderURL } from '@/api/order';

type FormData = {
  productType: string;
  quantity: number | null;
};

export default function ModalOrderLicenses() {
  const { t } = useTranslation(['dashboard/users/order-licenses', 'common']);
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const ovhSubsidiary = context.environment.getUser()
    .ovhSubsidiary as OvhSubsidiary;
  const region = context.environment.getRegion();
  const { data: dataLicenceDetail } = useOfficeLicenseDetail();
  const { data: catalog } = useOrderCatalog({
    productName: 'officePrepaid',
    ovhSubsidiary,
  });
  const productOptions = useMemo(
    () =>
      catalog?.plans
        .map((plan) => ({
          label: plan.invoiceName,
          value: plan.planCode,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [catalog],
  );

  const orderBaseURL = getExpressOrderURL(region, ovhSubsidiary);
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: {
      productType: '',
      quantity: null,
    },
  });

  const onSubmit = (data: FormData) => {
    const products = [
      {
        planCode: data.productType,
        quantity: data.quantity || 1,
        serviceName: dataLicenceDetail?.tenantServiceName as string,
      },
    ];
    window.open(
      generateOrderURL({ baseURL: orderBaseURL, products }),
      '_blank',
    );
  };

  return (
    <Modal
      title={t('dashboard_users_order_licences_title')}
      onClose={onClose}
      isDismissible
      isOpen
      secondaryButton={{
        label: t('common:cta_cancel'),
        action: onClose,
        testid: 'cancel-btn',
        variant: ODS_BUTTON_VARIANT.outline,
      }}
      primaryButton={{
        label: t('common:cta_confirm'),
        action: handleSubmit(onSubmit),
        testid: 'confirm-btn',
        isDisabled: !watch('productType'),
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap">
          <OdsFormField className="w-3/5 mr-8">
            <label slot="label" htmlFor="form-product-type">
              {t('dashboard_users_order_licences_type')}
            </label>
            <Controller
              name="productType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <OdsSelect
                  name="productType"
                  id="form-product-type"
                  {...field}
                  aria-label={t('dashboard_users_order_licences_type')}
                  onOdsChange={(event) => field.onChange(event.target.value)}
                >
                  {productOptions?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </OdsSelect>
              )}
            />
          </OdsFormField>
          <OdsFormField>
            <label slot="label" htmlFor="form-quantity">
              {t('dashboard_users_order_licences_quantity')}
            </label>
            <Controller
              name="quantity"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field }) => (
                <OdsQuantity
                  data-testid="quantity"
                  id="form-quantity"
                  name="quantity"
                  value={field.value || 1}
                  aria-label={t('dashboard_users_order_licences_quantity')}
                  onOdsChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                  max={300}
                  min={1}
                />
              )}
            />
          </OdsFormField>
        </div>
        <OdsMessage className="mt-4 mb-6" isDismissible={false}>
          <div>
            <span className="block">
              {t('dashboard_users_order_licences_message_1')}
            </span>
            <span>{t('dashboard_users_order_licences_message_2')}</span>
          </div>
        </OdsMessage>
      </form>
    </Modal>
  );
}
