import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { DeepReadonly } from '@/types/utils.type';

export type TActionsMenuItem = DeepReadonly<{
  label: string;
  link: {
    path: string;
    isExternal: boolean;
  };
}>;

export type TActionsMenuProps = DeepReadonly<{
  items: Map<string, TActionsMenuItem[]>;
}>;

export type TActionsMenuLinkProps = DeepReadonly<{
  item: TActionsMenuItem;
}>;

export const ActionMenuItem: FC<TActionsMenuLinkProps> = ({ item }) => {
  const { t } = useTranslation('list');
  const internalHref = useHref(item.link.path);

  const href = item.link.isExternal ? item.link.path : internalHref;

  return (
    <DropdownMenuItem
      className="cursor-pointer text-base text-blue-700 font-semibold focus:text-blue-700 focus:bg-[--ods-color-primary-100]"
      asChild
    >
      <a href={href} data-testid="actions-menu-item">
        {t(item.label)}
      </a>
    </DropdownMenuItem>
  );
};

export const ActionsMenu = ({ items }: TActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={!items.size}>
        <Button
          data-testid="actions-menu-button"
          className="size-9 p-0 text-primary border-primary border bg-background font-semibold hover:bg-primary-100 rounded-8 data-[state=open]:bg-[--ods-color-primary-100] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <OsdsIcon
            name={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.xxs}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top">
        {Array.from(items.entries()).map(([group, item], index, arr) => (
          <div key={group}>
            {item.map((elt) => (
              <ActionMenuItem key={elt.label} item={elt} />
            ))}
            {arr.length - 1 !== index && (
              <DropdownMenuSeparator className="bg-[--ods-color-form-element-border-default]" />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
