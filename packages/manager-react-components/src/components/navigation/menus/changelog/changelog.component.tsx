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
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '../../../typography';
import '../translations/translation';
import GithubIcon from './changelog.icon';

export interface ChangelogLinks {
  changelog: string;
  roadmap: string;
  'feature-request': string;
}

export interface ChangelogButtonProps {
  links: ChangelogLinks;
  chapters?: string[];
}

export const CHANGELOG_PREFIXES = ['tile-changelog-roadmap', 'external-link'];
const GO_TO = (link: string) => `go-to-${link}`;

export const ChangelogButton: React.FC<ChangelogButtonProps> = ({
  links,
  chapters = [],
}) => {
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

        {Object.entries(links).map(([key, link]) => {
          return (
            <OsdsMenuGroup key={key}>
              <OsdsMenuItem>
                <Links
                  href={link}
                  target={OdsHTMLAnchorElementTarget._blank}
                  rel={OdsHTMLAnchorElementRel.external}
                  type={LinkType.external}
                  label={t(`mrc_changelog_${key}`)}
                  onClickReturn={() =>
                    trackClick({
                      actionType: 'navigation',
                      actions: [...chapters, ...CHANGELOG_PREFIXES, GO_TO(key)],
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
