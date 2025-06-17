import { FC } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { TBaseAction } from '@/types/instance/action/action.type';
import { DeepReadonly } from '@/types/utils.type';

type TBaseActionMenuProps = DeepReadonly<{ items: TBaseAction[] }>;

const BaseActionMenuItem: FC<{ item: TBaseAction }> = ({ item }) => {
  const { t } = useTranslation('actions');
  const internalHref = useHref(item.link.path);

  const href = item.link.isExternal ? item.link.path : internalHref;

  return (
    <DropdownMenuItem
      className="cursor-pointer text-base text-blue-700 font-semibold focus:text-blue-700 focus:bg-[--ods-color-primary-100]"
      asChild
    >
      <a
        href={href}
        {...(item.link.target === 'blank' && {
          target: '_blank',
        })}
      >
        {t(item.label)}
        {item.link.target === 'blank' && (
          <OsdsIcon
            name={ODS_ICON_NAME.EXTERNAL_LINK}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.xxs}
            className="ml-3"
          />
        )}
      </a>
    </DropdownMenuItem>
  );
};

const BaseActionsMenu: FC<TBaseActionMenuProps> = ({ items }) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild disabled={!items.length}>
      <Button
        data-testid="actions-menu-button"
        className="size-9 p-0 text-primary bg-background font-semibold hover:bg-primary-100 data-[state=open]:bg-[--ods-color-primary-100] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <OsdsIcon
          name={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.xxs}
        />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" side="top">
      {items.map((item) => (
        <div key={item.link.path}>
          <BaseActionMenuItem item={item} />
        </div>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default BaseActionsMenu;
