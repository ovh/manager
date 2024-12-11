import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_BUTTON_COLOR,
  ODS_LINK_COLOR,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsLink, OdsPopover } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import '../translations/translation';

import { ManagerButton } from '../../../ManagerButton/ManagerButton';

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
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  isCompact?: boolean;
  icon?: ODS_ICON_NAME;
  variant?: ODS_BUTTON_VARIANT;
  id: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const MenuItem = ({
  item,
  isTrigger,
  id,
}: {
  item: Omit<ActionMenuItem, 'id'>;
  isTrigger: boolean;
  id: number;
}) => {
  const buttonProps = {
    size: ODS_BUTTON_SIZE.sm,
    variant: ODS_BUTTON_VARIANT.ghost,
    displayTooltip: false,
    className: 'w-full action-menu-item',
    ...item,
  };

  if (item.href) {
    return (
      <div className="-mx-[2px]">
        <OdsLink
          className="block w-full action-menu-item p-2"
          color={ODS_LINK_COLOR.primary}
          href={item.href}
          download={item.download}
          label={item.label}
          isDisabled={item.isDisabled}
          onClick={item.onClick}
        />
      </div>
    );
  }

  return (
    <div className="-mx-[2px]">
      {!item?.iamActions || item?.iamActions?.length === 0 ? (
        <OdsButton {...buttonProps} />
      ) : (
        <ManagerButton id={`${id}`} isIamTrigger={isTrigger} {...buttonProps} />
      )}
    </div>
  );
};

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  isCompact,
  icon,
  variant = ODS_BUTTON_VARIANT.outline,
  isDisabled = false,
  isLoading = false,
  id,
}) => {
  const { t } = useTranslation('buttons');
  const [isTrigger, setIsTrigger] = React.useState(false);

  return (
    <>
      <div key={id} id={`navigation-action-trigger-${id}`}>
        <OdsButton
          data-testid="navigation-action-trigger-action"
          className="action-menu-btn"
          slot="menu-title"
          id={id}
          variant={variant}
          isDisabled={isDisabled}
          isLoading={isLoading}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => setIsTrigger(true)}
          {...(!isCompact && { label: t('common_actions') })}
          icon={
            icon ||
            (isCompact
              ? ODS_ICON_NAME.ellipsisVertical
              : ODS_ICON_NAME.chevronDown)
          }
        />
      </div>
      <OdsPopover
        className="py-[8px] px-0 overflow-hidden"
        triggerId={`navigation-action-trigger-${id}`}
        with-arrow
      >
        {items.map(({ id: itemId, ...item }) => (
          <MenuItem
            id={itemId}
            key={itemId}
            item={item}
            isTrigger={isTrigger}
          />
        ))}
      </OdsPopover>
    </>
  );
};

export default ActionMenu;
