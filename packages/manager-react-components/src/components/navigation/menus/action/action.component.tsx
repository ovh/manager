import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsPopover } from '@ovhcloud/ods-components/react';
import {
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import '../translations/translation';

import { ManagerButton } from '../../../ManagerButton/ManagerButton';

export interface ActionMenuItem {
  id: number;
  rel?: OdsHTMLAnchorElementRel;
  download?: string;
  href?: string;
  target?: OdsHTMLAnchorElementTarget;
  onClick?: () => void;
  label: string;
  variant?: ODS_BUTTON_VARIANT;
  disabled?: boolean;
  iamActions?: string[];
  urn?: string;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  isCompact?: boolean;
  icon?: ODS_ICON_NAME;
  disabled?: boolean;
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
    ...item,
  };
  return (
    <div>
      {!item?.iamActions || item?.iamActions?.length === 0 ? (
        <OdsButton
          {...buttonProps}
          isDisabled={buttonProps.disabled}
          label={item.label}
        >
          <span slot="start">
            <span>{item.label}</span>
          </span>
        </OdsButton>
      ) : (
        <ManagerButton
          id={`${id}`}
          isIamTrigger={isTrigger}
          iamActions={item.iamActions}
          urn={item.urn}
          {...buttonProps}
          isDisabled={buttonProps.disabled || undefined}
        >
          <span slot="start">
            <span>{item.label}</span>
          </span>
        </ManagerButton>
      )}
    </div>
  );
};

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  isCompact,
  icon,
  disabled,
}) => {
  const { t } = useTranslation('buttons');
  const [isTrigger, setIsTrigger] = React.useState(false);

  return (
    <>
      <div id="navigation-action-trigger">
        <OdsButton
          data-testid="navigation-action-trigger-action"
          slot="menu-title"
          variant={ODS_BUTTON_VARIANT.outline}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => setIsTrigger(true)}
          {...(!isCompact && { label: t('common_actions') })}
          icon={
            icon ?? isCompact
              ? ODS_ICON_NAME.ellipsisHorizontal
              : ODS_ICON_NAME.chevronDown
          }
        />
      </div>
      <OdsPopover triggerId="navigation-action-trigger">
        {items.map(({ id, ...item }) => {
          return (
            <MenuItem id={id} key={id} item={item} isTrigger={isTrigger} />
          );
        })}
      </OdsPopover>
    </>
  );
};

export default ActionMenu;
