import React from 'react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsPopover, OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '../../../typography';
import '../translations/translation';

export interface ChangelogItem {
  id: number;
  href: string;
  download?: string;
  target?: string;
  rel?: string;
  labelKey: string;
  onClick?: () => void;
}

export interface ChangelogButtonProps {
  items: ChangelogItem[];
}

export const ChangelogButton: React.FC<ChangelogButtonProps> = ({ items }) => {
  const { t } = useTranslation('buttons');
  return (
    <>
      <div id="navigation-menu-changelog-trigger">
        <OdsButton
          slot="menu-title"
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          label={t('mrc_changelog_header')}
          className="whitespace-nowrap"
        ></OdsButton>
      </div>

      <OdsPopover
        triggerId="navigation-menu-changelog-trigger"
        with-arrow="true"
      >
        {items.map((item) => (
          <div key={item.id}>
            <Links
              href={item.href}
              target={item.target}
              download={item.download}
              rel={item.rel}
              type={LinkType.external}
              label={t(`mrc_changelog_${item.labelKey}`)}
              onClickReturn={item.onClick}
            />
          </div>
        ))}
      </OdsPopover>
    </>
  );
};

export default ChangelogButton;
