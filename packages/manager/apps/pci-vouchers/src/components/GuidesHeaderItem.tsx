import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { OsdsMenuItem } from '@ovhcloud/ods-components/menu/react';

interface GuidesHeaderItemProps {
  href: string;
  label: string;
}
export default function GuidesHeaderItem({
  href,
  label,
}: GuidesHeaderItemProps) {
  return (
    <OsdsMenuItem>
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        href={href}
        color={ODS_THEME_COLOR_INTENT.primary}
      >
        <span slot={'start'}>
          <OsdsText
            size={ODS_THEME_TYPOGRAPHY_SIZE._500}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {label}
          </OsdsText>
          <OsdsIcon
            name={ODS_ICON_NAME.EXTERNAL_LINK}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.xxs}
            className={'ml-1'}
          ></OsdsIcon>
        </span>
      </OsdsButton>
    </OsdsMenuItem>
  );
}
