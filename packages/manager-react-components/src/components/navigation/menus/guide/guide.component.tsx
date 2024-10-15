import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsMenu,
  OsdsMenuGroup,
  OsdsMenuItem,
  OsdsButton,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { ReactI18NextChild, useTranslation } from 'react-i18next';
import { Links, LinkType } from '../../../typography';
import '../translations/translation';

export interface GuideItem {
  id: number;
  href: string;
  download?: string;
  target?: OdsHTMLAnchorElementTarget;
  rel?: OdsHTMLAnchorElementRel;
  label: ReactI18NextChild | Iterable<ReactI18NextChild>;
}

export interface GuideButtonProps {
  items: GuideItem[];
}

export const GuideButton: React.FC<GuideButtonProps> = ({ items }) => {
  const { t } = useTranslation('buttons');
  return (
    <OsdsMenu>
      <OsdsButton
        slot="menu-title"
        className="block mb-6"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.sm}
        inline
      >
        <span slot="start">
          <OsdsIcon
            name={ODS_ICON_NAME.GUIDES}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.sm}
          />
        </span>
        {t('user_account_guides_header')}
      </OsdsButton>

      {items.map((item) => (
        <OsdsMenuGroup key={item.id}>
          <OsdsMenuItem>
            <Links
              href={item.href}
              target={item.target}
              download={item.download}
              rel={item.rel}
              type={LinkType.external}
              label={item.label}
            />
          </OsdsMenuItem>
        </OsdsMenuGroup>
      ))}
    </OsdsMenu>
  );
};

export default GuideButton;
