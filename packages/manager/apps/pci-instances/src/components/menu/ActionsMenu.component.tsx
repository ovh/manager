import { FC, useState } from 'react';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  ButtonProp,
  Divider,
  Icon,
  ICON_NAME,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ovhcloud/ods-react';
import { DeepReadonly } from '@/types/utils.type';
import { ActionMenuItem, TActionsMenuItem } from './ActionMenuItem.component';

export type TActionsMenuProps = DeepReadonly<{
  items: Map<string, TActionsMenuItem[]> | TActionsMenuItem[];
  actionButton?: Pick<ButtonProp, 'variant'>;
}>;

export const ActionsMenu: FC<TActionsMenuProps> = ({ items, actionButton }) => {
  const [isOpen, setOpen] = useState(false);
  const size =
    items instanceof Map ? items.size : (items as TActionsMenuItem[]).length;

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
          disabled={!size}
          size="sm"
          variant={BUTTON_VARIANT.outline}
          {...actionButton}
        >
          <Icon name={ICON_NAME.ellipsisVertical} className="text-xl/4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent withArrow onClick={() => setOpen(false)} className="p-0">
        {items instanceof Map
          ? (Array.from(items.entries()) as [string, TActionsMenuItem[]][]).map(
              ([group, item], index, arr) => (
                <div key={group}>
                  {item.map((elt: TActionsMenuItem) => (
                    <ActionMenuItem key={elt.label} item={elt} />
                  ))}
                  {arr.length - 1 !== index && <Divider className="m-0" />}
                </div>
              ),
            )
          : (items as TActionsMenuItem[]).map((item) => (
              <ActionMenuItem key={item.label} item={item} />
            ))}
      </PopoverContent>
    </Popover>
  );
};
