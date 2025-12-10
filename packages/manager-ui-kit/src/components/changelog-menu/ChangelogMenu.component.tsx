import React from 'react';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { ActionMenu } from '@/components/action-menu/ActionMenu.component';
import {
  ChangelogMenuLinks,
  ChangelogMenuProps,
} from '@/components/changelog-menu/ChangelogMenu.props';
import { LinkType } from '@/components/link/Link.props';

import './translations/translation';

export const CHANGELOG_PREFIXES = ['tile-changelog-roadmap', 'external-link'];
const GO_TO = (link: string) => `go-to-${link}`;

const LinksTrad = {
  changelog: 'mrc_changelog_changelog',
  roadmap: 'mrc_changelog_roadmap',
  'feature-request': 'mrc_changelog_feature-request',
} as const;

export const ChangelogMenu: React.FC<ChangelogMenuProps> = ({ links, chapters = [], prefixes }) => {
  const { t } = useTranslation('changelog-menu');
  const { trackClick } = useOvhTracking();

  const effectivePrefixes = prefixes ?? CHANGELOG_PREFIXES;

  const sendTrackClick = (key: keyof typeof LinksTrad) => {
    trackClick({
      actionType: 'navigation',
      actions: [...chapters, ...effectivePrefixes, GO_TO(key)],
    });
  };

  const linksArray = Object.keys(links).map((key, index) => {
    const typedKey = key as keyof typeof LinksTrad;
    return {
      id: index,
      label: t(LinksTrad[typedKey]),
      href: links[key as keyof ChangelogMenuLinks],
      linktype: LinkType.external,
      onClick: () => sendTrackClick(typedKey),
    };
  });

  return (
    <ActionMenu
      variant={BUTTON_VARIANT.ghost}
      label={t('mrc_changelog_header')}
      id="changelog-button"
      displayIcon={false}
      items={linksArray}
    />
  );
};
