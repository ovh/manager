import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_DIVIDER_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';

type TileButtonProps = {
  title: string;
  href: string;
  isDisabled: boolean;
};

export default function TileButton({
  title,
  href,
  isDisabled,
}: Readonly<TileButtonProps>) {
  return (
    <>
      <OsdsButton
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        href={href}
        {...(isDisabled ? { disabled: true } : {})}
        inline
      >
        <span slot="start">{title}</span>
        <span slot="end">
          <OsdsIcon
            name={ODS_ICON_NAME.CHEVRON_RIGHT}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </span>
      </OsdsButton>
      <OsdsDivider separator size={ODS_DIVIDER_SIZE.zero} />
    </>
  );
}
