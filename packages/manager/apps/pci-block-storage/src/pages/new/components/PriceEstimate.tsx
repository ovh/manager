import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  useCatalogPrice,
  convertHourlyPriceToMonthly,
} from '@ovh-ux/manager-react-components';
import { TAddon } from '@ovh-ux/manager-pci-common';

export interface PriceEstimateProps {
  volumeCapacity: number;
  volumeType: TAddon;
}

export function PriceEstimate({
  volumeCapacity,
  volumeType,
}: PriceEstimateProps) {
  const { t } = useTranslation('add');
  const { getFormattedCatalogPrice } = useCatalogPrice(3, {
    hideTaxLabel: true,
  });
  const { price } =
    volumeType?.pricings?.find(({ type }) => type === 'consumption') || {};
  const priceEstimate = convertHourlyPriceToMonthly(price * volumeCapacity);

  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {t('pci_projects_project_storages_blocks_add_submit_price_text', {
        price: getFormattedCatalogPrice(priceEstimate),
      })}
    </OsdsText>
  );
}
