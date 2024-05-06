import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_BUTTON_TYPE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsMenu,
  OsdsMenuItem,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import {
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-common-core';
import { ReactI18NextChild, useTranslation } from 'react-i18next';
import '../translations/translation';

import { ManagerButton } from '../../../ManagerButton/ManagerButton';

export interface ActionMenuItem {
  id: number;
  rel?: OdsHTMLAnchorElementRel;
  download?: string;
  href?: string;
  target?: OdsHTMLAnchorElementTarget;
  onClick?: () => void;
  label: ReactI18NextChild | Iterable<ReactI18NextChild>;
  color?: ODS_THEME_COLOR_INTENT;
  variant?: ODS_BUTTON_VARIANT;
  disabled?: boolean;
  iamActions?: string[];
  urn?: string;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  isCompact?: boolean;
  disabled?: boolean;
}

const MenuItem = ({
  item,
  isTrigger,
}: {
  item: Omit<ActionMenuItem, 'id'>;
  isTrigger: boolean;
}) => {
  const buttonProps = {
    size: ODS_BUTTON_SIZE.sm,
    color: ODS_THEME_COLOR_INTENT.primary,
    variant: ODS_BUTTON_VARIANT.ghost,
    displayTooltip: false,
    ...item,
  };
  return (
    <OsdsMenuItem>
      {!item?.iamActions || item?.iamActions?.length === 0 ? (
        <OsdsButton
          {...buttonProps}
          disabled={buttonProps.disabled || undefined}
        >
          <span slot="start">
            <span>{item.label}</span>
          </span>
        </OsdsButton>
      ) : (
        <ManagerButton
          isIamTrigger={isTrigger}
          iamActions={item.iamActions}
          urn={item.urn}
          {...buttonProps}
          disabled={buttonProps.disabled || undefined}
        >
          <span slot="start">
            <span>{item.label}</span>
          </span>
        </ManagerButton>
      )}
    </OsdsMenuItem>
  );
};

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  isCompact,
  disabled,
}) => {
  const { t } = useTranslation('buttons');
  const [isTrigger, setIsTrigger] = React.useState(false);

  return (
    <OsdsMenu disabled={disabled || undefined}>
      <OsdsButton
        slot="menu-title"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        inline
        circle={isCompact || undefined}
        onClick={() => setIsTrigger(true)}
      >
        {!isCompact && t('common_actions')}
        <span slot={!isCompact ? 'end' : undefined}>
          <OsdsIcon
            name={
              isCompact
                ? ODS_ICON_NAME.ELLIPSIS
                : ODS_ICON_NAME.ARROW_DOWN_CONCEPT
            }
            color={ODS_THEME_COLOR_INTENT.primary}
            size={isCompact ? ODS_ICON_SIZE.xs : ODS_ICON_SIZE.xxs}
            data-testid="action-menu-icon"
          />
        </span>
      </OsdsButton>

      {items.map(({ id, ...item }) => {
        return <MenuItem key={id} item={item} isTrigger={isTrigger} />;
      })}
    </OsdsMenu>
  );
};

export default ActionMenu;
