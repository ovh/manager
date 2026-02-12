import { useContext, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldLabel,
  ICON_NAME,
  MODAL_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  Quantity,
  QuantityControl,
  QuantityInput,
  Select,
  SelectContent,
  SelectControl,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, OvhSubsidiary } from '@ovh-ux/muk';

import { CANCEL, CONFIRM, ORDER_ACCOUNT } from '@/Tracking.constants';
import { generateOrderURL } from '@/data/api/order/utils';
import { useLicenseDetail } from '@/data/hooks/license-details/useLicenseDetails';
import { useOrderCatalog } from '@/data/hooks/order-catalog/useOrderCatalog';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';

type FormData = {
  productType: string;
  quantity: number | null;
};

export default function ModalOrderLicenses() {
  const { t } = useTranslation(['dashboard/users/order-licenses', 'common']);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const ovhSubsidiary = context.environment.getUser().ovhSubsidiary as OvhSubsidiary;
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
      actions: [ORDER_ACCOUNT, productType ? `${action}_${productType}` : action],
    });

  const { handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: {
      productType: '',
      quantity: null,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    tracking(CONFIRM, data.productType);
    const products = [
      {
        planCode: data.productType,
        quantity: data.quantity || 1,
        serviceName: dataLicenceDetail?.tenantServiceName,
      },
    ];
    window.open(generateOrderURL({ baseURL: orderBaseURL, products }), '_blank');
  };

  const handleCancelClick = () => {
    tracking(CANCEL);
    onClose();
  };

  return (
    <Modal
      heading={t('dashboard_users_order_licences_title')}
      type={MODAL_COLOR.information}
      open={true}
      secondaryButton={{ label: t(`${NAMESPACES.ACTIONS}:cancel`), onClick: handleCancelClick }}
      onOpenChange={handleCancelClick}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:confirm`),
        disabled: !watch('productType'),
        onClick: () => void handleSubmit(onSubmit)(),
      }}
    >
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <div className="mb-4 flex flex-wrap justify-between">
          <FormField className="w-full md:w-3/5">
            <FormFieldLabel>
              {t('dashboard_users_order_licences_type')} - {t(`${NAMESPACES.FORM}:required`)}
            </FormFieldLabel>
            <Controller
              name="productType"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, name } }) => (
                <Select
                  data-testid={name}
                  name={name}
                  aria-label={t('dashboard_users_order_licences_type')}
                  onValueChange={(event) => onChange(event.value[0])}
                  items={productOptions}
                >
                  <SelectControl placeholder={t(`${NAMESPACES.ACTIONS}:select`)} />
                  <SelectContent createPortal={false} />
                </Select>
              )}
            />
          </FormField>
          <FormField>
            <FormFieldLabel>
              {t('dashboard_users_order_licences_quantity')} - {t(`${NAMESPACES.FORM}:required`)}
            </FormFieldLabel>
            <Controller
              name="quantity"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field: { onChange, name } }) => (
                <Quantity
                  name={name}
                  defaultValue={String(1)}
                  onValueChange={(event) => onChange(Number(event.value))}
                  max={300}
                  min={1}
                >
                  <QuantityControl>
                    <QuantityInput data-testid={name} />
                  </QuantityControl>
                </Quantity>
              )}
            />
          </FormField>
        </div>
        <Message className="mb-6 mt-4" dismissible={false}>
          <MessageIcon name={ICON_NAME.circleInfo} />
          <MessageBody>
            <span className="block">{t('dashboard_users_order_licences_message_1')}</span>
            <span>{t('dashboard_users_order_licences_message_2')}</span>
          </MessageBody>
        </Message>
      </form>
    </Modal>
  );
}
