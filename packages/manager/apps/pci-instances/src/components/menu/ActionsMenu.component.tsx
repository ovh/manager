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
import { ActionMenuItem } from './ActionMenuItem.component';
import { TAction } from '@/types/instance/action/action.type';

export type TActionsMenuProps = DeepReadonly<{
  items: Map<string, TAction[]>;
  actionButton?: Pick<ButtonProp, 'variant'>;
}>;

export const ActionsMenu: FC<TActionsMenuProps> = ({ items, actionButton }) => {
  const [isOpen, setOpen] = useState(false);
  const { size } = items;

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
        {Array.from(items.entries()).map(([group, item], index) => (
          <div key={group}>
            {index !== 0 && <Divider className="m-0" />}
            {item.map((action: TAction) => (
              <ActionMenuItem key={action.label} {...action} />
            ))}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
