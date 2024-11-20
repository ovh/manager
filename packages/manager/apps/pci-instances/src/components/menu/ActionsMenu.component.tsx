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
  ODS_DIVIDER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsMenu,
  OsdsMenuItem,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { FC, useMemo } from 'react';
import { DeepReadonly } from '@/types/utils.type';

export type TActionsMenuItem = DeepReadonly<{
  label: string;
  href?: string;
  group?: string;
  onMenuItemClick?: () => void;
}>;
export type TActionsMenuProps = {
  items: TActionsMenuItem[];
};

export const groupActionMenuItems = (items: TActionsMenuItem[]) =>
  items.reduce<Record<string, TActionsMenuItem[]>>(
    (acc, { group, ...rest }) => {
      if (!group) {
        const others: TActionsMenuItem[] = acc.others || [];
        return { ...acc, others: [...others, rest] };
      }
      return { ...acc, [group]: [...(acc[group] || []), rest] };
    },
    {},
  );

export const ActionsMenu: FC<TActionsMenuProps> = ({ items }) => {
  const groupedItems = useMemo(() => groupActionMenuItems(items), [items]);

  return (
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
      {Object.values(groupedItems).map((value, index, arr) => (
        <div key={`group-${index}`}>
          {value.map(({ label, href, onMenuItemClick }) => (
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
          {arr.length - 1 !== index && (
            <div className="px-4">
              <OsdsDivider separator size={ODS_DIVIDER_SIZE.one} />
            </div>
          )}
        </div>
      ))}
    </OsdsMenu>
  );
};
