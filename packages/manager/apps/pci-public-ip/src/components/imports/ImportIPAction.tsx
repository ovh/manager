import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsMenu,
  OsdsMenuItem,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

export const ImportIPAction = ({ ip }: { ip: string }) => {
  const { t } = useTranslation('imports');

  const ipEncoded = encodeURIComponent(ip).replace('%2F', '~2F');

  const hrefMoveIP = useHref(`./${ipEncoded}`);

  return (
    <OsdsMenu>
      <OsdsButton
        slot="menu-title"
        circle
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.ELLIPSIS}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.xxs}
        ></OsdsIcon>
      </OsdsButton>
      <OsdsMenuItem>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          href={hrefMoveIP}
        >
          <OsdsText
            size={ODS_THEME_TYPOGRAPHY_SIZE._500}
            level={ODS_TEXT_LEVEL.button}
            color={ODS_THEME_COLOR_INTENT.primary}
            slot="start"
          >
            {t('pci_additional_ips_failoverip_imports_importIp')}
          </OsdsText>
        </OsdsButton>
      </OsdsMenuItem>
    </OsdsMenu>
  );
};
