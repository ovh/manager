/* eslint-disable react/no-multi-comp */
import { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  ButtonProp,
  Divider,
  Icon,
  ICON_NAME,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
  actionButton?: Pick<ButtonProp, 'variant'>;
}>;

export type TActionsMenuLinkProps = DeepReadonly<{
  item: TActionsMenuItem;
}>;

const linkClassname =
  'w-full box-border p-5 bg-none hover:bg-none hover:bg-[--ods-color-primary-100] focus-visible:bg-[--ods-color-primary-100] focus-visible:rounded-sm focus-visible:outline-none text-blue-700 hover:text-blue-500 focus-visible:text-blue-500';

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
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Popover
      position="bottom"
      open={isOpen}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button
          data-testid="actions-menu-button"
          color={BUTTON_COLOR.primary}
          {...props}
        >
          <Icon name={ICON_NAME.ellipsisVertical} />
        </Button>
      </PopoverTrigger>
      <PopoverContent withArrow onClick={() => setOpen(false)} className="p-0">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export const ActionsMenu = ({ items, actionButton }: TActionsMenuProps) => (
  <ActionMenuContainer
    size="sm"
    disabled={!items.size}
    variant={BUTTON_VARIANT.outline}
    {...actionButton}
  >
    {Array.from(items.entries()).map(([group, item], index, arr) => (
      <div key={group}>
        {item.map((elt) => (
          <ActionMenuItem key={elt.label} item={elt} />
        ))}
        {arr.length - 1 !== index && <Divider className="m-0" />}
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
