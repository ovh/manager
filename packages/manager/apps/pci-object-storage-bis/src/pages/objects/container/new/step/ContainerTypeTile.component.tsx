import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useCatalog } from '@ovh-ux/manager-pci-common';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import { CONTAINER_COMMERCIAL_NAME } from '@/constants';

export interface ContainerTypeTileProps {
  type: string;
  isSelected: boolean;
}

export function ContainerTypeTile({
  type,
  isSelected,
}: Readonly<ContainerTypeTileProps>) {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const { getTextPrice } = useCatalogPrice();
  const { data: catalog, isPending } = useCatalog('cloud');
  const addons = catalog?.addons?.filter(
    (addon) => addon?.blobs?.commercial?.name === CONTAINER_COMMERCIAL_NAME,
  );
  const [pricing] = addons.map((addon) =>
    addon.pricings?.find((addonPricing) =>
      addonPricing?.capacities?.includes('renew'),
    ),
  );

  return (
    <>
      <OdsText
        preset="paragraph"
        className={clsx('leading-8', isSelected && 'selected-tile-title')}
      >
        <span>
          {t(`pci_projects_project_storages_containers_add_type_${type}_label`)}
        </span>
      </OdsText>
      <p>
        <OdsText preset="caption">
          {t(
            `pci_projects_project_storages_containers_add_type_${type}_description`,
          )}
        </OdsText>
      </p>
      <p>
        {isPending && <OdsSkeleton />}
        {!isPending && pricing && (
          <OdsText preset="caption" className="font-bold">
            {t('pci_projects_project_storages_containers_add_type_price', {
              price: getTextPrice(pricing.price),
            })}
          </OdsText>
        )}
      </p>
    </>
  );
}
