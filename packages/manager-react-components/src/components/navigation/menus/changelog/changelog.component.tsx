import React from 'react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsMenu,
  OsdsMenuGroup,
  OsdsMenuItem,
  OsdsButton,
} from '@ovhcloud/ods-components/react';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '../../../typography';
import '../translations/translation';
import GithubIcon from './changelog.icon';

export interface ChangelogItem {
  id: number;
  href: string;
  download?: string;
  target?: OdsHTMLAnchorElementTarget;
  rel?: OdsHTMLAnchorElementRel;
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
      <OsdsMenu>
        <OsdsButton
          slot="menu-title"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          className="whitespace-nowrap"
        >
          <span slot="start">
            <GithubIcon />
          </span>
          {t('mrc_changelog_header')}
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
                label={t(`mrc_changelog_${item.labelKey}`)}
                onClickReturn={item.onClick}
              />
            </OsdsMenuItem>
          </OsdsMenuGroup>
        ))}
      </OsdsMenu>
    </>
  );
};

export default ChangelogButton;
