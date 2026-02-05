import React, { useId } from 'react';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_POPOVER_POSITION,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsPopover, OdsTooltip } from '@ovhcloud/ods-components/react';

import { ManagerButton } from '@ovh-ux/manager-react-components';

export interface ActionMenuItem {
  id: number;
  rel?: string;
  href?: string;
  download?: string;
  target?: string;
  onClick?: () => void;
  label: string;
  variant?: ODS_BUTTON_VARIANT;
  iamActions?: string[];
  urn?: string;
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  color?: ODS_BUTTON_COLOR;
  'data-testid'?: string;
  tooltipMessage?: string;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  isCompact?: boolean;
  icon?: ODS_ICON_NAME;
  variant?: ODS_BUTTON_VARIANT;
  id: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  popoverPosition?: ODS_POPOVER_POSITION;
  label?: string;
}

const ButtonItem = ({
  item,
  isTrigger,
  id,
}: {
  item: Omit<ActionMenuItem, 'id'>;
  isTrigger: boolean;
  id: string;
}) => {
  const buttonProps = {
    size: ODS_BUTTON_SIZE.sm,
    variant: ODS_BUTTON_VARIANT.ghost,
    displayTooltip: false,
    className: 'menu-item-button w-full',
    ...item,
    id,
  };

  return !item?.iamActions || item?.iamActions?.length === 0 || item.isDisabled ? (
    <OdsButton {...buttonProps} />
  ) : (
    <ManagerButton isIamTrigger={isTrigger} {...buttonProps} />
  );
};

const MenuItem = ({
  item,
  isTrigger,
}: {
  item: Omit<ActionMenuItem, 'id'>;
  isTrigger: boolean;
  id: number;
}) => {
  const tooltipId = useId();

  const tooltip = item.tooltipMessage ? (
    <OdsTooltip triggerId={`tooltip-action-${tooltipId}`} position="left" withArrow>
      {item.tooltipMessage}
    </OdsTooltip>
  ) : (
    <></>
  );

  if (item.href && !item.isDisabled) {
    return (
      <>
        <a href={item.href} download={item.download} target={item.target}>
          <ButtonItem item={item} isTrigger={isTrigger} id={`tooltip-action-${tooltipId}`} />
        </a>
        {tooltip}
      </>
    );
  }

  return (
    <>
      <ButtonItem item={item} isTrigger={isTrigger} id={`tooltip-action-${tooltipId}`} />
      {tooltip}
    </>
  );
};

// Duplicated component of MRC to wait tooltip feature #17501
export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  isCompact,
  icon,
  variant = ODS_BUTTON_VARIANT.outline,
  isDisabled = false,
  isLoading = false,
  id,
  popoverPosition,
  label = '',
}) => {
  const [isTrigger, setIsTrigger] = React.useState(false);

  return (
    <>
      <div key={id} id={`navigation-action-trigger-${id}`} className="w-min">
        <OdsButton
          data-testid="navigation-action-trigger-action"
          slot="menu-title"
          id={id}
          variant={variant}
          isDisabled={isDisabled}
          isLoading={isLoading}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => setIsTrigger(true)}
          icon={icon || (isCompact ? ODS_ICON_NAME.ellipsisVertical : ODS_ICON_NAME.chevronDown)}
          aria-label={isCompact ? '' : label}
          label={isCompact ? '' : label}
        />
      </div>
      <OdsPopover
        className="w-max px-0 py-2"
        data-testid="navigation-action-trigger-action-popover"
        triggerId={`navigation-action-trigger-${id}`}
        with-arrow
        position={popoverPosition}
      >
        <div className="flex flex-col">
          {items.map(({ id: itemId, ...item }) => (
            <MenuItem id={itemId} key={itemId} item={item} isTrigger={isTrigger} />
          ))}
        </div>
      </OdsPopover>
    </>
  );
};

export default ActionMenu;
