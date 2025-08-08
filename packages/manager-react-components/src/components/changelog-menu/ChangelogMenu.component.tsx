import React from 'react';
import { BUTTON_VARIANT } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '../action-menu';
import { LinkType } from '../Link';
import { ChangelogMenuProps } from './ChangelogMenu.props';
import './translations/translation';

export const CHANGELOG_PREFIXES = ['tile-changelog-roadmap', 'external-link'];
const GO_TO = (link: string) => `go-to-${link}`;

export const ChangelogMenu: React.FC<ChangelogMenuProps> = ({
  links,
  chapters = [],
  prefixes,
}) => {
  const { t } = useTranslation('changelog-menu');
  const { trackClick } = useOvhTracking();

  const sendTrackClick = (key: string) => {
    trackClick({
      actionType: 'navigation',
      actions: [...chapters, ...(prefixes || CHANGELOG_PREFIXES), GO_TO(key)],
    });
  };

  return (
    <ActionMenu
      variant={BUTTON_VARIANT.ghost}
      label={t('mrc_changelog_header')}
      id="changelog-button"
      displayIcon={false}
      items={[
        {
          id: 1,
          label: t('mrc_changelog_changelog'),
          href: links.changelog,
          linktype: LinkType.external,
          onClick: () => sendTrackClick('changelog'),
        },
        {
          id: 2,
          label: t('mrc_changelog_roadmap'),
          href: links.roadmap,
          linktype: LinkType.external,
          onClick: () => sendTrackClick('roadmap'),
        },
        {
          id: 3,
          label: t('mrc_changelog_feature-request'),
          href: links['feature-request'],
          linktype: LinkType.external,
          onClick: () => sendTrackClick('feature-request'),
        },
      ]}
    />
  );
};
