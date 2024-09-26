import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
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

  const editNameHref = useHref('./edit-name');

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
            value={
              <div className="flex mb-4">
                <OsdsText
                  className="flex items-center"
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {loadBalancerName}
                </OsdsText>
                <OsdsButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_BUTTON_SIZE.sm}
                  variant={ODS_BUTTON_VARIANT.ghost}
                  href={editNameHref}
                  className="items-center"
                >
                  <OsdsIcon
                    size={ODS_ICON_SIZE.xxs}
                    name={ODS_ICON_NAME.PEN}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </OsdsButton>
              </div>
            }
            /* value={loadBalancerName} */
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
