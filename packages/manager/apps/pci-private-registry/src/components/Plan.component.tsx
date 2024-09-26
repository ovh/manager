import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsSkeleton, OsdsText } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { useBytes, useCatalog, Pricing } from '@ovh-ux/manager-pci-common';
import clsx from 'clsx';
import { TRegistryPlan } from '@/api/data/registry';

export type TPlanComponentProps = {
  plan: TRegistryPlan;
};

export default function PlanComponent({
  plan,
}: Readonly<TPlanComponentProps>): JSX.Element {
  const { t: tUpgrade } = useTranslation('upgrade');

  const { data: catalog, isPending } = useCatalog();

  const addon = useMemo(() => {
    if (catalog) {
      return catalog.addons.find((a) => a.planCode === plan.code);
    }
    return null;
  }, [catalog, plan]);

  const pricing = addon?.pricings[0];

  // @TODO remove pricingInterval when catalog API is fixed
  // In the case of private registry the API is incorrectly returning 'none' instead of 'hour' as pricingInterval
  // In order to display the correct pricing interval we use planCode parsing
  const hourlyPricing = /hour\.consumption/.test(addon?.planCode)
    ? 'hour'
    : false;
  const monthlyPricing = /month\.consumption/.test(addon?.planCode)
    ? 'month'
    : false;
  const pricingInterval = hourlyPricing || monthlyPricing || 'none';

  const { formatBytes } = useBytes();

  return (
    <div className="w-full">
      <div className="border-solid border border-t-0 border-x-0 border-[--ods-color-blue-200] my-4 py-4 mx-8">
        <OsdsText
          data-testid="name"
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
        >
          {plan.name[0]}
        </OsdsText>
      </div>
      {isPending && (
        <div className="min-h-[10rem] mx-6">
          <OsdsSkeleton />
          <OsdsSkeleton />
          <OsdsSkeleton />
          <OsdsSkeleton />
          <OsdsSkeleton />
        </div>
      )}
      {!isPending && (
        <ul className="list-none p-0 m-0 min-h-[8rem] mx-8">
          <li data-testid="capacity">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            >
              {tUpgrade('private_registry_upgrade_plan_available_storage')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            >
              {formatBytes(plan.registryLimits.imageStorage, 2, 1024)}
            </OsdsText>
          </li>
          <li data-testid="connections">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            >
              {tUpgrade('private_registry_upgrade_plan_connections', {
                total: plan.registryLimits.parallelRequest,
              })}
            </OsdsText>
          </li>
          {plan.name === 'SMALL' && (
            <li data-testid="core-registry-99">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {tUpgrade('private_registry_upgrade_core_registry_99')}
              </OsdsText>
            </li>
          )}
          {plan.name !== 'SMALL' && (
            <>
              <li data-testid="core-registry-95">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                >
                  {tUpgrade('private_registry_upgrade_core_registry_95')}
                </OsdsText>
              </li>
              <li>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                >
                  {tUpgrade('private_registry_upgrade_other_components')}
                </OsdsText>
              </li>
            </>
          )}
          {plan.features.vulnerability && (
            <li>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {tUpgrade('private_registry_upgrade_plan_vulnerability')}
              </OsdsText>
            </li>
          )}
          {addon?.blobs.technical.bandwidth.unlimited && (
            <li>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {tUpgrade('private_registry_upgrade_plan_traffic')}
              </OsdsText>
            </li>
          )}
        </ul>
      )}
      <div
        className={clsx(
          'border-solid border border-b-0 border-x-0 border-[--ods-color-blue-200] mb-2 pt-4 mt-9 text-center py-4',
        )}
        data-testid="price"
      >
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          <Pricing
            pricing={pricing}
            options={{
              decimals: 4,
              intervalUnit: pricingInterval,
            }}
          />
        </OsdsText>
      </div>
    </div>
  );
}
