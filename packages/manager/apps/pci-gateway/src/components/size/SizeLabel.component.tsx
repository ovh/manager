import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  useCatalogPrice,
  convertHourlyPriceToMonthly,
} from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { TProductAddonDetail } from '@/types/product.type';

export default function SizeLabel({
  size,
  bandwidth,
  price,
}: Readonly<TProductAddonDetail>) {
  const { t } = useTranslation('catalog-selector');

  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(4);

  return (
    <div className="grid grid-cols-1 gap-2 text-left text w-full">
      <div className="">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_gateways_model_selector_size', {
            size: size.toUpperCase(),
          })}
        </OsdsText>
      </div>
      <div className="text-sm font-normal">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {bandwidth > 1000
            ? t(
                'pci_projects_project_gateways_model_selector_bandwidth_unit_size_gbps',
                { bandwidth: bandwidth / 1000 },
              )
            : t(
                'pci_projects_project_gateways_model_selector_bandwidth_unit_size_mbps',
                { bandwidth },
              )}
        </OsdsText>
      </div>
      <hr className="w-full border-solid border-0 border-b border-[--ods-color-blue-200]" />
      <div className="text-sm mt-4 text-center">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {getFormattedHourlyCatalogPrice(price)}
        </OsdsText>
      </div>
      <div className="text-sm text-center font-normal">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          ~{' '}
          {getFormattedMonthlyCatalogPrice(convertHourlyPriceToMonthly(price))}
        </OsdsText>
      </div>
    </div>
  );
}
