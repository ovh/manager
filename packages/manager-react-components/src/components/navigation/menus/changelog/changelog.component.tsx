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
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

export interface ChangelogItem {
  href: string;
  chapters?: string[];
}

export interface ChangelogButtonProps {
  items: Record<string, ChangelogItem>;
}

export const CHANGELOG_PREFIXES = ['tile-changelog-roadmap', 'external-link'];
const GO_TO = (link: string) => `go-to-${link}`;

export const ChangelogButton: React.FC<ChangelogButtonProps> = ({ items }) => {
  const { t } = useTranslation('buttons');
  const { trackClick } = useOvhTracking();
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

        {Object.entries(items).map(([key, item]) => {
          return (
            <OsdsMenuGroup key={key}>
              <OsdsMenuItem>
                <Links
                  href={item.href}
                  target={OdsHTMLAnchorElementTarget._blank}
                  rel={OdsHTMLAnchorElementRel.external}
                  type={LinkType.external}
                  label={t(`mrc_changelog_${key}`)}
                  onClickReturn={() =>
                    trackClick({
                      actionType: 'navigation',
                      actions: [
                        ...item.chapters,
                        ...CHANGELOG_PREFIXES,
                        GO_TO(key),
                      ],
                    })
                  }
                />
              </OsdsMenuItem>
            </OsdsMenuGroup>
          );
        })}
      </OsdsMenu>
    </>
  );
};

export default ChangelogButton;
