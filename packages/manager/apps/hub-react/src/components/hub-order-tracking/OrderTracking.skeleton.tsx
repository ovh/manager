import { useTranslation } from 'react-i18next';
import {
  OsdsSkeleton,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_SKELETON_SIZE,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';

export default function OrderTrackingSkeleton() {
  const { t } = useTranslation('hub/order');

  return (
    <OsdsTile
      className="block p-1 bg-[var(--ods-color-primary-200)] p-6"
      variant={ODS_TILE_VARIANT.ghost}
      inline
    >
      <div className="bg-500 !flex flex-col gap-1 items-center justifier-center">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.primary}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          className="block"
          size={ODS_TEXT_SIZE._300}
        >
          {t('hub_order_tracking_title')}
        </OsdsText>
        <OsdsSkeleton
          className="font-bold text-right flex flex-col items-center justifier-center my-6"
          inline
          size={ODS_SKELETON_SIZE.sm}
        />

        <div className="mb-6 flex justify-center gap-3 items-center flex-wrap">
          <OsdsSkeleton inline size={ODS_SKELETON_SIZE.md} />
        </div>
        <OsdsSkeleton inline size={ODS_SKELETON_SIZE.sm} />
      </div>
    </OsdsTile>
  );
}
