import { ReactElement } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';

import BillingStep, { TBillingStepProps } from '@/components/create/BillingStep.component';
import { nodesAreAssignedPublicIp } from '@/helpers/node-pool';
import useFloatingIpsPrice from '@/hooks/useFloatingIpsPrice';
import useNodeLocalStorage from '@/hooks/useNodeLocalStorage';
import usePublicIpPrice from '@/hooks/usePublicIpPrice';
import useRepricingInstancesAvailable from '@/hooks/useRepricingInstancesAvailable';
import { DeploymentMode, TClusterPlan } from '@/types';

import { useNewPoolStore } from '../store';

type TFinalBillingStepProps = {
  isAdding: boolean;
  price: number;
  monthlyPrice?: number;
  monthlyBilling: TBillingStepProps['monthlyBilling'];
  warn: boolean;
  region?: string | null;
  regionType?: DeploymentMode | null;
  plan?: TClusterPlan;
  hasPrivateNetwork?: boolean;
  onCreate: () => void;
  onCancel: () => void;
};

export default function FinalBillingStep({
  isAdding,
  region,
  regionType,
  plan,
  hasPrivateNetwork,
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
  const hasRepricing = useRepricingInstancesAvailable();
  const localStorage = useNodeLocalStorage(store.flavor, region);
  const { price: publicIpPrice } = usePublicIpPrice(region ?? null);
  const nodesUsePublicIp = nodesAreAssignedPublicIp({
    hasRepricing,
    plan,
    hasPrivateNetwork: !!hasPrivateNetwork,
  });

  return (
    <>
      <BillingStep
        price={price}
        numberOfNodes={store.scaling?.quantity.desired}
        priceFloatingIp={store.attachFloatingIps?.enabled && store.flavor ? floatingIpPrice : null}
        pricePublicIp={nodesUsePublicIp ? publicIpPrice : null}
        priceLocalStorage={hasRepricing ? localStorage.price : null}
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
