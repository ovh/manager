import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import TileLine from '@/components/detail/TileLine.component';
import { getFormattedDate } from '@/helpers';

export interface GeneralInformationProps {
  loadBalancerName: string;
  loadBalancerRegion: string;
  loadBalancerCreationDate: string;
  loadBalancerId: string;
}

export default function GeneralInformation({
  loadBalancerName,
  loadBalancerRegion,
  loadBalancerCreationDate,
  loadBalancerId,
}: GeneralInformationProps) {
  const { t: tOverview } = useTranslation('octavia_load_balancer_overview');

  return (
    <div>
      <OsdsTile
        className="flex-col w-full shadow-lg"
        inline
        rounded
        variant={ODS_TILE_VARIANT.ghost}
      >
        <div className="flex flex-col w-full">
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tOverview('octavia_load_balancer_overview_info_title')}
          </OsdsText>

          <OsdsDivider separator />

          <TileLine
            title={tOverview('octavia_load_balancer_overview_info_name')}
            value={loadBalancerName}
          />

          <TileLine
            title={tOverview('octavia_load_balancer_overview_info_region')}
            value={loadBalancerRegion}
          />

          <TileLine
            title={tOverview(
              'octavia_load_balancer_overview_info_creation_date',
            )}
            value={getFormattedDate(loadBalancerCreationDate, 'PP')}
          />

          <TileLine
            title={tOverview('octavia_load_balancer_overview_info_id')}
            value={loadBalancerId}
            type="clipboard"
          />
        </div>
      </OsdsTile>
    </div>
  );
}
