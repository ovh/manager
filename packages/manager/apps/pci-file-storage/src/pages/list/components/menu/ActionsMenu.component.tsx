import React, { useState } from 'react';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  ButtonProp,
  Divider,
  ICON_NAME,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ovhcloud/ods-react';

import { ActionMenuItem } from './ActionMenuItem.component';
import type { TShareAction } from './action.type';

export type TActionsMenuProps = Readonly<{
  items: Map<string, TShareAction[]>;
  actionButton?: Pick<ButtonProp, 'variant'>;
}>;

export const ActionsMenu: React.FC<TActionsMenuProps> = ({ items, actionButton }) => {
  const [isOpen, setOpen] = useState(false);
  const { size } = items;

  return (
    <Popover position="bottom" open={isOpen} onOpenChange={({ open }) => setOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          color={BUTTON_COLOR.primary}
          disabled={!size}
          size="sm"
          variant={BUTTON_VARIANT.ghost}
          className="rounded-md"
          aria-label="actions"
          type="button"
          {...actionButton}
        >
          <Icon name={ICON_NAME.ellipsisVertical} className="text-xl/4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent withArrow onClick={() => setOpen(false)} className="p-0">
        {Array.from(items.entries()).map(([group, item], index) => (
          <div key={group}>
            {index !== 0 && <Divider className="m-0" />}
            {item.map((action: TShareAction) => (
              <ActionMenuItem key={action.labelTranslationKey} {...action} />
            ))}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
