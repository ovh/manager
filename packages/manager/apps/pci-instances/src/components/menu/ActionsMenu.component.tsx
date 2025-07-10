/* eslint-disable react/no-multi-comp */
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Link,
  ButtonProp,
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

const ActionMenuContainer: FC<PropsWithChildren & ButtonProp> = ({
  children,
  ...props
}) => (
  <Popover position="bottom">
    <PopoverTrigger
      // prevent default to avoid auto hiding the dropdown on mobile device
      onTouchEnd={(e) => e.preventDefault()}
      asChild
    >
      <Button data-testid="actions-menu-button" {...props}>
        <OsdsIcon
          name={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.xxs}
        />
      </Button>
    </PopoverTrigger>
    <PopoverContent>{children}</PopoverContent>
  </Popover>
);

export const ActionsMenu = ({ items }: TActionsMenuProps) => (
  <ActionMenuContainer variant="outline" size="sm" disabled={!items.size}>
    {Array.from(items.entries()).map(([group, item], index, arr) => (
      <div key={group}>
        {item.map((elt) => (
          <ActionMenuItem key={elt.label} item={elt} />
        ))}
        {arr.length - 1 !== index && <Divider />}
      </div>
    ))}
  </ActionMenuContainer>
);

type TBaseActionsMenu = { items: TActionsMenuItem[] };

export const BaseActionsMenu = ({ items }: TBaseActionsMenu) => (
  <ActionMenuContainer variant="ghost" size="sm" disabled={!items.length}>
    {items.map((item) => (
      <ActionMenuItem key={item.label} item={item} />
    ))}
  </ActionMenuContainer>
);
