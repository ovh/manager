import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
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

export interface ActionItem {
  id: number;
  rel?: OdsHTMLAnchorElementRel;
  download?: string;
  href: string;
  target: OdsHTMLAnchorElementTarget;
  label: ReactI18NextChild | Iterable<ReactI18NextChild>;
}

export interface ActionButtonProps {
  items: ActionItem[];
}

export const ActionButton: React.FC<ActionButtonProps> = ({ items }) => {
  const { t } = useTranslation('buttons');
  return (
    <OsdsMenu>
      <OsdsButton
        slot="menu-title"
        className="block mb-6"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
        inline
      >
        {t('common_actions')}
        <span slot="end">
          <OsdsIcon
            name={ODS_ICON_NAME.ARROW_DOWN_CONCEPT}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.xxs}
          />
        </span>
      </OsdsButton>

      {items.map((item) => (
        <OsdsMenuItem key={item.id}>
          <OsdsButton
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.ghost}
            href={item.href}
            rel={item.rel}
            target={item.target}
            download={item.download}
          >
            {item.label}
          </OsdsButton>
        </OsdsMenuItem>
      ))}
    </OsdsMenu>
  );
};

export default ActionButton;
