import React, { FunctionComponent } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
  ODS_TILE_VARIANT,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';

type Props = {
  message: string;
  refetch: () => void;
  className?: string;
  tileVarian?: ODS_TILE_VARIANT;
};

export const TileError: FunctionComponent<Props> = ({
  message,
  refetch,
  className,
  tileVarian,
}) => {
  const { t } = useTranslation('hub/error');
  return (
    <OsdsTile variant={tileVarian} className={className} inline>
      <div className="flex gap-1 flex-col items-center">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.error}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          className="block"
          size={ODS_TEXT_SIZE._400}
        >
          {t('manager_error_tile_title')}
        </OsdsText>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.error}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          className="block"
        >
          {message}
        </OsdsText>
        <OsdsButton
          onClick={refetch}
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.error}
          variant={ODS_BUTTON_VARIANT.ghost}
          inline={true}
        >
          {t('manager_error_tile_action_reload_label')}
          <span slot="end">
            <OsdsIcon
              hoverable
              name={ODS_ICON_NAME.REFRESH}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.error}
            />
          </span>
        </OsdsButton>
      </div>
    </OsdsTile>
  );
};
