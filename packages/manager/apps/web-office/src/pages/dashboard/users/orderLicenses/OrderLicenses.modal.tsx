import { useContext, useMemo } from 'react';
import {
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsQuantity,
} from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import { Modal, OvhSubsidiary } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useForm, Controller } from 'react-hook-form';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useGenerateUrl } from '@/hooks';
import { useLicenseDetail, useOrderCatalog } from '@/data/hooks';
import { generateOrderURL } from '@/data/api/order';
import { CANCEL, CONFIRM, ORDER_ACCOUNT } from '@/tracking.constants';

type FormData = {
  productType: string;
  quantity: number | null;
};

export default function ModalOrderLicenses() {
  const { t } = useTranslation([
    'dashboard/users/order-licenses',
    'common',
    NAMESPACES.ACTIONS,
  ]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const ovhSubsidiary = context.environment.getUser()
    .ovhSubsidiary as OvhSubsidiary;
  const region = context.environment.getRegion();
  const { data: dataLicenceDetail } = useLicenseDetail();
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

  const tracking = (action: string, productType?: string) =>
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [
        ORDER_ACCOUNT,
        productType ? `${action}_${productType}` : action,
      ],
    });

  const { handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: {
      productType: '',
      quantity: null,
    },
  });

  const onSubmit = (data: FormData) => {
    tracking(CONFIRM, data.productType);
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

  const handleCancelClick = () => {
    tracking(CANCEL);
    onClose();
  };

  return (
    <Modal
      heading={t('dashboard_users_order_licences_title')}
      type={ODS_MODAL_COLOR.information}
      isOpen={true}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
      onDismiss={handleCancelClick}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
      isPrimaryButtonDisabled={!watch('productType')}
      onPrimaryButtonClick={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap justify-between mb-4">
          <OdsFormField className="w-full md:w-3/5">
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
