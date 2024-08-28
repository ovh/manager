import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsPopover, OdsButton } from '@ovhcloud/ods-components/react';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '../../../typography';
import '../translations/translation';

export interface GuideItem {
  id: number;
  href: string;
  download?: string;
  target?: OdsHTMLAnchorElementTarget;
  rel?: OdsHTMLAnchorElementRel;
  label: string;
}

export interface GuideButtonProps {
  items: GuideItem[];
}

export const GuideButton: React.FC<GuideButtonProps> = ({ items }) => {
  const { t } = useTranslation('buttons');
  return (
    <>
      <div id="navigation-menu-guide-trigger">
        <OdsButton
          slot="menu-title"
          className="block mb-6"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          label={t('user_account_guides_header')}
          icon={ODS_ICON_NAME.book}
        />
      </div>

      <OdsPopover triggerId="navigation-menu-guide-trigger">
        {items.map((item) => (
          <div key={item.id}>
            <Links
              href={item.href}
              target={item.target}
              download={item.download}
              rel={item.rel}
              type={LinkType.external}
              label={item.label}
            />
          </div>
        ))}
      </OdsPopover>
    </>
  );
};

export default GuideButton;
