import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { useCatalogPrice } from '@ovhcloud/manager-components';
import { TCapability } from '@/api/data/capability';
import { useTranslatedBytes } from '@/pages/create/useTranslatedBytes';
import { useGetCatalog } from '@/api/hooks/useCatalog';

export default function PlanComponent({
  plan,
}: {
  plan: TCapability['plans'][0];
}): JSX.Element {
  const { t: tUpgrade } = useTranslation('upgrade');

  const { data: catalog } = useGetCatalog();

  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice(4);

  const addon = useMemo(() => {
    if (catalog) {
      return catalog.addons.find((a) => a.planCode === plan.code);
    }
    return null;
  }, [catalog, plan]);

  const capacity = useTranslatedBytes(
    plan.registryLimits.imageStorage,
    2,
    true,
    'B',
    false,
  );
  return (
    <div className="w-full">
      <div className="border-solid border border-t-0 border-x-0 border-[--ods-color-blue-200] my-4 py-4">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
        >
          {plan.name[0]}
        </OsdsText>
      </div>
      <ul className="list-none p-0 m-0">
        <li>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          >
            {tUpgrade('private_registry_upgrade_plan_available_storage')}:
          </OsdsText>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          >
            {capacity}
          </OsdsText>
        </li>
        <li>
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
          <li>
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
            <li>
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
      <div className="border-solid border border-b-0 border-x-0 border-[--ods-color-blue-200] my-2">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          {getFormattedMonthlyCatalogPrice(addon?.pricings[0].price)}{' '}
        </OsdsText>
      </div>
    </div>
  );
}
