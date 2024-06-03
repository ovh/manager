import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { TSizeItem } from '@/api/hooks/data';
import { useCatalogPrice } from '@/hooks/catalog-price';

export const SizeLabelComponent = ({ item }: { item: TSizeItem }) => {
  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(4);

  return (
    <div className="grid grid-cols-1 gap-2 text-left text w-full">
      <div className="">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {item.label}
        </OsdsText>
      </div>
      <hr className="w-full border-solid border-0 border-b border-b-[#85d9fd]" />
      <div className="text-sm">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {item.bandwidthLabel}
        </OsdsText>
      </div>
      <div className="text-sm mt-4">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {getFormattedHourlyCatalogPrice(item.hourlyPrice)} (
          {getFormattedMonthlyCatalogPrice(item.monthlyPrice)})<span>*</span>
        </OsdsText>
      </div>
    </div>
  );
};
