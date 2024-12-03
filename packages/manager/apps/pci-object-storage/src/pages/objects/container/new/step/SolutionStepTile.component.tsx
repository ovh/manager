import { clsx } from 'clsx';
import { useCatalog } from '@ovh-ux/manager-pci-common';
import {
  HOUR_IN_MONTH,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  OsdsChip,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  MEGA_BYTES,
  OBJECT_CONTAINER_OFFERS_LABELS,
  PLAN_CODES,
} from '@/constants';

export function SolutionStepTileComponent({ item, isItemSelected }) {
  const { t } = useTranslation('containers/add');
  const { data: catalog, isPending } = useCatalog('cloud');
  const { getTextPrice } = useCatalogPrice();
  const hourlyPrice =
    catalog?.addons.find((addon) => addon.planCode === PLAN_CODES[item])
      ?.pricings?.[0]?.price *
    HOUR_IN_MONTH *
    MEGA_BYTES;

  return (
    <div>
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className={clsx('leading-8', isItemSelected && 'font-bold')}
      >
        <span className="mr-4">
          {t(`pci_projects_project_storages_containers_add_offer_${item}`)}
        </span>
        {OBJECT_CONTAINER_OFFERS_LABELS[item]?.beta && (
          <OsdsChip
            color={ODS_THEME_COLOR_INTENT.warning}
            inline
            size={ODS_CHIP_SIZE.sm}
          >
            <span className={isItemSelected ? 'font-bold' : ''}>
              {t(
                `pci_projects_project_storages_containers_add_offer_${item}_label`,
              )}
            </span>
          </OsdsChip>
        )}
        {OBJECT_CONTAINER_OFFERS_LABELS[item]?.new && (
          <OsdsChip
            inline
            size={ODS_CHIP_SIZE.sm}
            className="bg-[--ods-color-blue-200]"
          >
            {t(
              `pci_projects_project_storages_containers_add_offer_${item}_label`,
            )}
          </OsdsChip>
        )}
        {OBJECT_CONTAINER_OFFERS_LABELS[item]?.recommanded && (
          <OsdsChip
            inline
            size={ODS_CHIP_SIZE.sm}
            className="bg-[--ods-color-blue-200]"
          >
            <span className={isItemSelected ? 'font-bold' : ''}>
              {t(
                `pci_projects_project_storages_containers_add_offer_${item}_recommanded`,
              )}
            </span>
          </OsdsChip>
        )}
      </OsdsText>
      <p>
        <OsdsText
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t(
            `pci_projects_project_storages_containers_add_offer_${item}_description`,
          )}
        </OsdsText>
      </p>
      <p>
        {isPending && <OsdsSkeleton />}
        {!isPending && (
          <OsdsText
            size={ODS_TEXT_SIZE._100}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            className="font-bold"
          >
            {t(
              'pci_projects_project_storages_containers_add_offers_estimated_price',
              {
                price: getTextPrice(hourlyPrice) || '?',
              },
            )}
          </OsdsText>
        )}
      </p>
    </div>
  );
}
