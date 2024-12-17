import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useCatalog } from '@ovh-ux/manager-pci-common';
import { OsdsSkeleton, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
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
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className={clsx('leading-8', isSelected && 'font-bold')}
      >
        {t(`pci_projects_project_storages_containers_add_type_${type}_label`)}
      </OsdsText>
      <p>
        <OsdsText
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t(
            `pci_projects_project_storages_containers_add_type_${type}_description`,
          )}
        </OsdsText>
      </p>
      <p>
        {isPending && <OsdsSkeleton />}
        {!isPending && pricing && (
          <OsdsText
            size={ODS_TEXT_SIZE._100}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            className="font-bold"
          >
            {t('pci_projects_project_storages_containers_add_type_price', {
              price: getTextPrice(pricing.price),
            })}
          </OsdsText>
        )}
      </p>
    </>
  );
}
