import { ReactElement } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  Card,
  ICON_NAME,
  Icon,
  Link,
  Message,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import {
  convertHourlyPriceToMonthly,
  useCatalogPrice,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';

import useSavingsPlanAvailable from '@/hooks/useSavingPlanAvailable';

const checkedClass =
  'cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';
const uncheckedClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';
const separatorClass = 'h-px my-5 bg-[#85d9fd] border-0';

export type TBillingStepProps = {
  price: number | null;
  monthlyPrice?: number;
  selectedAvailabilityZonesNumber?: number;
  numberOfNodes?: number | null;
  priceFloatingIp?: { hour: number | null; month: number | null } | null;
  monthlyBilling: {
    isComingSoon: boolean;
    isChecked: boolean;
    check: (val: boolean) => void;
  };
  warn: boolean;
};

const calculatePrice = (basePrice: number | null, zonesNumber = 1, optionalPrice = 0): number => {
  const price = Number(basePrice);

  return zonesNumber * (price + optionalPrice);
};

export default function BillingStep(props: TBillingStepProps): ReactElement {
  const { t } = useTranslation(['billing-anti-affinity', 'add', 'node-pool', 'flavor-billing']);

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4, {
    exclVat: true,
  });

  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice(2, {
    exclVat: true,
  });

  const projectURL = useProjectUrl('public-cloud');
  const savingsPlanUrl = `${projectURL}/savings-plan`;
  const showSavingPlan = useSavingsPlanAvailable();

  const computedPrice = calculatePrice(
    props.price,
    props.selectedAvailabilityZonesNumber,
    (props.priceFloatingIp?.hour ?? 0) * (props.numberOfNodes ?? 0),
  );
  const hourlyPrice = getFormattedHourlyCatalogPrice(computedPrice);
  const monthlyPrice = getFormattedMonthlyCatalogPrice(convertHourlyPriceToMonthly(computedPrice));
  const monthlyLegacyPrice = getFormattedMonthlyCatalogPrice(
    (props.monthlyPrice ?? 0) + (props.priceFloatingIp?.month ?? 0),
  );
  return (
    <div className="max-w-3xl">
      <div className="my-6">
        <Text className="text-[--ods-color-text-500] my-6" preset={TEXT_PRESET.heading4}>
          {t('flavor-billing:pci_projects_project_instances_configure_billing_type')}
        </Text>
        {props.monthlyBilling.isComingSoon && showSavingPlan ? (
          <div className="max-w-3xl">
            <Message data-testid="coming_soon_message" color="information" dismissible={false}>
              <MessageIcon name={ICON_NAME.circleInfo} />
              <div className="flex flex-col">
                <Text>{t('kubernetes_add_billing_savings_plan_banner')}</Text>
                <Link className="mt-2 flex items-baseline" target="_blank" href={savingsPlanUrl}>
                  {t('kubernetes_add_billing_savings_plan_cta')}
                  <Icon className="w-3 h-3" aria-hidden="true" name="arrow-right" />
                </Link>
              </div>
            </Message>
          </div>
        ) : (
          <Text data-testid="billing_description">
            {t('add:kube_add_billing_type_description')}{' '}
            {props.monthlyPrice &&
              props.monthlyPrice > 0 &&
              t('add:kubernetes_add_billing_type_description_monthly')}
          </Text>
        )}
      </div>

      <div className="flex gap-10 my-8">
        <Card
          data-testid="hourly_tile"
          className={clsx(
            !props.monthlyBilling.isChecked ? checkedClass : uncheckedClass,
            'w-1/2 p-[--ods-size-tile-md-padding]',
          )}
          onClick={() => {
            props.monthlyBilling.check(false);
          }}
        >
          <div className="w-full ">
            <Text>{t('flavor-billing:pci_project_flavors_billing_hourly')}</Text>
            <hr className={separatorClass} />
            <Text className="block">
              <span className="font-bold">
                {t('flavor-billing:pci_project_flavors_billing_price_hourly_price_label')}
              </span>
              {hourlyPrice}
            </Text>
            <Text>
              <span className="font-bold">
                {t('node-pool:kube_common_node_pool_estimation_cost_tile')}:{' '}
              </span>
              {monthlyPrice}
            </Text>
            {props.priceFloatingIp && (
              <Text className="block italic">
                {t(
                  'flavor-billing:pci_projects_project_instances_configure_billing_type_floating_ip_cost',
                )}
              </Text>
            )}
          </div>
        </Card>

        {!props.monthlyBilling.isComingSoon && (
          <Card
            data-testid="monthly_tile"
            className={clsx(
              props.monthlyBilling.isChecked ? checkedClass : uncheckedClass,
              'w-1/2 p-[--ods-size-tile-md-padding]',
            )}
            onClick={() => {
              props.monthlyBilling.check(true);
            }}
          >
            <div className="w-full">
              <Text>{t('flavor-billing:pci_project_flavors_billing_monthly')}</Text>
              <hr className={separatorClass} />
              <Text className="block">
                <span className="font-bold">
                  {t(
                    'flavor-billing:pci_project_flavors_billing_price_monthly_instance_price_label',
                  )}
                </span>
                {monthlyLegacyPrice}
              </Text>
              {props.priceFloatingIp && (
                <Text className="block italic">
                  {t(
                    'flavor-billing:pci_projects_project_instances_configure_billing_type_floating_ip_cost',
                  )}
                </Text>
              )}
            </div>
          </Card>
        )}
      </div>

      {props.warn && (
        <Message data-testid="warn_message" color="warning" className="my-6" dismissible={false}>
          <MessageIcon name={ICON_NAME.triangleExclamation} />
          <Text>{t('kubernetes_add_billing_auto_scaling_monthly_warning')}</Text>
        </Message>
      )}

      <Text className="block">{t('kubernetes_add_billing_type_payment_method')}</Text>
    </div>
  );
}
