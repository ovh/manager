import React from 'react';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
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
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';

type Props = {
  message: string;
  refetch: () => void;
  className?: string;
  contrasted?: boolean;
};

export default function TileError({
  message,
  refetch,
  className,
  contrasted,
}: Props) {
  const { t } = useTranslation('hub/error');
  return (
    <div className={`flex gap-1 flex-col items-center p-8 ${className}`}>
      <OsdsText
        {...(contrasted
          ? { contrasted }
          : { color: ODS_THEME_COLOR_INTENT.text })}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        className="block mb-6"
        size={ODS_TEXT_SIZE._600}
      >
        {t('manager_hub_error_tile_oops')}
      </OsdsText>
      <OsdsText
        {...(contrasted
          ? { contrasted }
          : { color: ODS_THEME_COLOR_INTENT.text })}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        className="block mb-5"
      >
        {message}
      </OsdsText>
      <OsdsButton
        onClick={refetch}
        size={ODS_BUTTON_SIZE.sm}
        {...(contrasted
          ? { contrasted }
          : { color: ODS_THEME_COLOR_INTENT.primary })}
        variant={ODS_BUTTON_VARIANT.ghost}
        inline
      >
        {t('manager_hub_error_tile_retry')}
        <span slot="end">
          <OsdsIcon
            hoverable
            name={ODS_ICON_NAME.REFRESH}
            size={ODS_ICON_SIZE.xs}
            {...(contrasted
              ? { contrasted }
              : { color: ODS_THEME_COLOR_INTENT.primary })}
          />
        </span>
      </OsdsButton>
    </div>
  );
}
