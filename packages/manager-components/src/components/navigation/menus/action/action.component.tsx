import React, { PropsWithChildren } from 'react';
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
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import {
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-common-core';
import { ReactI18NextChild, useTranslation } from 'react-i18next';
import '../translations/translation';

import { ManagerButton } from '../../../ManagerButton/ManagerButton';
import { useIsAuthorized } from '../../../../hooks/iam';

export interface ActionMenuItem {
  id: number;
  rel?: OdsHTMLAnchorElementRel;
  download?: string;
  href?: string;
  target?: OdsHTMLAnchorElementTarget;
  onClick?: () => void;
  label: ReactI18NextChild | Iterable<ReactI18NextChild>;
  isIamDisabled?: boolean;
  isIamAuthorized?: boolean;
  action?: string;
  urn?: string;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  isCompact?: boolean;
}

export type ActionMenuIamProps = PropsWithChildren<{
  action?: string;
  urn?: string;
}>;

export const ActionMenuIam = ({
  children,
  action,
  urn,
}: ActionMenuIamProps) => {
  const { t } = useTranslation('iam');
  const isAuthorized = useIsAuthorized(action, urn);
  if (!isAuthorized) {
    return (
      <OsdsTooltip>
        {children}
        <OsdsTooltipContent slot="tooltip-content">
          <div>{t('common_iam_actions_message')}</div>
        </OsdsTooltipContent>
      </OsdsTooltip>
    );
  }
  return <>{children}</>;
};

export const ActionMenu: React.FC<ActionMenuProps> = ({ items, isCompact }) => {
  const { t } = useTranslation('buttons');

  return (
    <OsdsMenu>
      <OsdsButton
        slot="menu-title"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        inline
        circle={isCompact || undefined}
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

      {items.map((item) => {
        const isAuthorized = useIsAuthorized(item.action, item.urn);
        return (
          <OsdsMenuItem key={item.id}>
            <ManagerButton
              action={item.action}
              urn={item.urn}
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.ghost}
              href={item.href}
              rel={item.rel}
              target={item.target}
              onClick={item.onClick}
              download={item.download}
            >
              <span slot="start">
                <span>{item.label}</span>
              </span>
            </ManagerButton>
          </OsdsMenuItem>
        );
      })}
    </OsdsMenu>
  );
};

export default ActionMenu;
