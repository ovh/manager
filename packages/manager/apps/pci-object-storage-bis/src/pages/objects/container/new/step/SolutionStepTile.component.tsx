import { clsx } from 'clsx';
import { useCatalog } from '@ovh-ux/manager-pci-common';
import {
  HOUR_IN_MONTH,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsBadge, OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import {
  MEGA_BYTES,
  OBJECT_CONTAINER_OFFERS_LABELS,
  PLAN_CODES,
} from '@/constants';

export function SolutionStepTileComponent({
  item,
  isItemSelected,
  hasStandardInfrequentAccess,
}) {
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
      <OdsText
        preset="paragraph"
        className={clsx('leading-8', isItemSelected && 'selected-tile-title')}
      >
        <span className="mr-4">
          {t(`pci_projects_project_storages_containers_add_offer_${item}`)}
        </span>
        {OBJECT_CONTAINER_OFFERS_LABELS[item]?.beta && (
          <OdsBadge
            color="warning"
            size="sm"
            label={t(
              `pci_projects_project_storages_containers_add_offer_${item}_label`,
            )}
          />
        )}
        {OBJECT_CONTAINER_OFFERS_LABELS[item]?.new && (
          <OdsBadge
            size="sm"
            label={t(
              `pci_projects_project_storages_containers_add_offer_${item}_label`,
            )}
          />
        )}
        {OBJECT_CONTAINER_OFFERS_LABELS[item]?.recommanded && (
          <OdsBadge
            size="sm"
            label={t(
              `pci_projects_project_storages_containers_add_offer_${item}_recommanded`,
            )}
          />
        )}
      </OdsText>
      <p>
        <OdsText preset="caption">
          {t(
            hasStandardInfrequentAccess
              ? `pci_projects_project_storages_containers_add_offer_${item}_description_standard_infrequent_access`
              : `pci_projects_project_storages_containers_add_offer_${item}_description`,
          )}
        </OdsText>
      </p>
      <p>
        {isPending && <OdsSkeleton />}
        {!isPending && (
          <>
            <OdsText preset="caption" className="caption-price">
              {t(
                hasStandardInfrequentAccess
                  ? 'pci_projects_project_storages_containers_add_offers_estimated_price_standard_infrequent_access'
                  : 'pci_projects_project_storages_containers_add_offers_estimated_price',
                {
                  price: getTextPrice(hourlyPrice) || '?',
                },
              )}
            </OdsText>
            &nbsp;
            {hasStandardInfrequentAccess && (
              <OdsText preset="caption">
                {t(
                  'pci_projects_project_storages_containers_add_offers_estimated_price_brackets',
                  {
                    price: getTextPrice(hourlyPrice) || '?',
                  },
                )}
              </OdsText>
            )}
          </>
        )}
      </p>
    </div>
  );
}
