import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsMenu,
  OsdsMenuItem,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { FC } from 'react';

export type TActionsMenuItem = {
  label: string;
  href?: string;
  onMenuItemClick?: () => void;
};
export type TActionsMenuProps = {
  items: TActionsMenuItem[];
};

export const ActionsMenu: FC<TActionsMenuProps> = ({ items }) => (
  <OsdsMenu>
    <OsdsButton
      data-testid="actions-menu-button"
      slot={'menu-title'}
      circle
      color={ODS_THEME_COLOR_INTENT.primary}
      variant={ODS_BUTTON_VARIANT.stroked}
    >
      <OsdsIcon
        name={ODS_ICON_NAME.ELLIPSIS}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_ICON_SIZE.xxs}
      />
    </OsdsButton>
    {items.map(({ label, href, onMenuItemClick }) => (
      <OsdsMenuItem key={label}>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          data-testid="actions-menu-item"
          {...(href && { href })}
          {...(onMenuItemClick && { onClick: onMenuItemClick })}
        >
          <OsdsText
            size={ODS_THEME_TYPOGRAPHY_SIZE._500}
            level={ODS_TEXT_LEVEL.button}
            color={ODS_THEME_COLOR_INTENT.primary}
            slot={'start'}
          >
            {label}
          </OsdsText>
        </OsdsButton>
      </OsdsMenuItem>
    ))}
  </OsdsMenu>
);
