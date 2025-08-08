/* eslint-disable react/no-multi-comp */
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Link,
} from '@ovhcloud/ods-react';
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

const linkClassname =
  'w-full box-border p-4 bg-none hover:bg-none hover:bg-[--ods-color-primary-100] hover:rounded-sm focus-visible:bg-[--ods-color-primary-100] focus-visible:rounded-sm focus-visible:outline-none text-blue-700 hover:text-blue-500 focus-visible:text-blue-500';

export const ActionMenuItem: FC<TActionsMenuLinkProps> = ({ item }) => {
  const { t } = useTranslation('list');
  const internalHref = useHref(item.link.path);

  const href = item.link.isExternal ? item.link.path : internalHref;

  return (
    <div>
      <Link
        href={href}
        data-testid="actions-menu-item"
        className={linkClassname}
      >
        {t(item.label)}
      </Link>
    </div>
  );
};

export const ActionsMenu = ({ items }: TActionsMenuProps) => {
  return (
    <Popover position="bottom">
      <PopoverTrigger
        // prevent default to avoid auto hiding the dropdown on mobile device
        onTouchEnd={(e) => e.preventDefault()}
        asChild
        disabled={!items.size}
      >
        <Button data-testid="actions-menu-button" variant="outline" size="sm">
          <OsdsIcon
            name={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.xxs}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {Array.from(items.entries()).map(([group, item], index, arr) => (
          <div key={group}>
            {item.map((elt) => (
              <ActionMenuItem key={elt.label} item={elt} />
            ))}
            {arr.length - 1 !== index && <Divider />}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
