import { ReactElement } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';

import BillingStep, { TBillingStepProps } from '@/components/create/BillingStep.component';
import useFloatingIpsPrice from '@/hooks/useFloatingIpsPrice';
import { DeploymentMode } from '@/types';

import { useNewPoolStore } from '../store';

type TFinalBillingStepProps = {
  isAdding: boolean;
  price: number;
  monthlyPrice?: number;
  monthlyBilling: TBillingStepProps['monthlyBilling'];
  warn: boolean;
  regionType?: DeploymentMode | null;
  onCreate: () => void;
  onCancel: () => void;
};

export default function FinalBillingStep({
  isAdding,
  regionType,
  price,
  monthlyPrice,
  monthlyBilling,
  warn,
  onCreate,
  onCancel,
}: TFinalBillingStepProps): ReactElement {
  const { t } = useTranslation(['common', 'kube', 'listing', 'add']);
  const store = useNewPoolStore();
  const floatingIpPriceData = useFloatingIpsPrice(true, regionType ?? null);
  const floatingIpPrice = floatingIpPriceData.price;

  return (
    <>
      <BillingStep
        price={price}
        numberOfNodes={store.scaling?.quantity.desired}
        priceFloatingIp={store.attachFloatingIps?.enabled && store.flavor ? floatingIpPrice : null}
        monthlyPrice={monthlyPrice}
        monthlyBilling={monthlyBilling}
        warn={warn}
      />

      {!isAdding ? (
        <div className="mt-4 flex">
          <OsdsButton onClick={onCreate} inline color={ODS_THEME_COLOR_INTENT.primary}>
            {t('listing:kube_common_save')}
          </OsdsButton>
          <OsdsButton
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.ghost}
            className="ml-4"
            onClick={onCancel}
          >
            {t('common_stepper_cancel_button_label')}
          </OsdsButton>
        </div>
      ) : (
        <div className="d-flex align-items-center">
          <OsdsSpinner inline />
          <OsdsText
            slot="label"
            color={ODS_THEME_COLOR_INTENT.text}
            className="mt-4"
            size={ODS_TEXT_SIZE._100}
          >
            {t('add:kube_add_node_pool_creating')}
          </OsdsText>
        </div>
      )}
    </>
  );
}
