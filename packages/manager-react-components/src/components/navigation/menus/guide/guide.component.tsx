import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsPopover, OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '../../../typography';
import '../translations/translation';

export interface GuideItem {
  id: number;
  href: string;
  download?: string;
  target?: string;
  rel?: string;
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
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          label={t('user_account_guides_header')}
          icon={ODS_ICON_NAME.book}
        />
      </div>

      <OdsPopover triggerId="navigation-menu-guide-trigger" with-arrow="true">
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
