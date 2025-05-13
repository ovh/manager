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
import { useFormattedDate } from '@/hooks/useFormattedDate';

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
  const { t } = useTranslation('load-balancer/overview');
  const creationDate = useFormattedDate(loadBalancerCreationDate, 'PP');

  const editNameHref = useHref('./edit-name');

  return (
    <div>
      <OsdsTile
        className="flex-col w-full shadow-custom-tile"
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
            {t('octavia_load_balancer_overview_info_title')}
          </OsdsText>

          <OsdsDivider separator />

          <TileLine
            title={t('octavia_load_balancer_overview_info_name')}
            value={
              <div className="flex items-center gap-2">
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {loadBalancerName}
                </OsdsText>
                <div className="min-w-12">
                  <OsdsButton
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_BUTTON_SIZE.sm}
                    variant={ODS_BUTTON_VARIANT.ghost}
                    href={editNameHref}
                  >
                    <OsdsIcon
                      size={ODS_ICON_SIZE.xxs}
                      name={ODS_ICON_NAME.PEN}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                  </OsdsButton>
                </div>
              </div>
            }
          />

          <TileLine
            title={t('octavia_load_balancer_overview_info_region')}
            value={loadBalancerRegion}
          />

          <TileLine
            title={t('octavia_load_balancer_overview_info_creation_date')}
            value={creationDate}
          />

          <TileLine
            title={t('octavia_load_balancer_overview_info_id')}
            value={loadBalancerId}
            type="clipboard"
          />
        </div>
      </OsdsTile>
    </div>
  );
}
