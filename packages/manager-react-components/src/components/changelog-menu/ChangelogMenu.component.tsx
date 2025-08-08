import React, { useEffect, useState } from 'react';
import { BUTTON_VARIANT } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '../action-menu';
import { LinkType } from '../Link';
import { ChangelogMenuProps } from './ChangelogMenu.props';
import './translations/translation';

export const CHANGELOG_PREFIXES = ['tile-changelog-roadmap', 'external-link'];
const GO_TO = (link: string) => `go-to-${link}`;

const LinksTrad = {
  changelog: 'mrc_changelog_changelog',
  roadmap: 'mrc_changelog_roadmap',
  'feature-request': 'mrc_changelog_feature-request',
};

export const ChangelogMenu: React.FC<ChangelogMenuProps> = ({
  links,
  chapters = [],
  prefixes,
}) => {
  const { t } = useTranslation('changelog-menu');
  const { trackClick } = useOvhTracking();
  const [linksArray, setLinksArray] = useState<
    {
      id: number;
      label: string;
      href: string;
      linktype: LinkType;
      onClick: () => void;
    }[]
  >([]);

  const sendTrackClick = (key: string) => {
    trackClick({
      actionType: 'navigation',
      actions: [...chapters, ...(prefixes || CHANGELOG_PREFIXES), GO_TO(key)],
    });
  };

  useEffect(() => {
    const linksTab = [];
    Object.keys(links).forEach((key, index) => {
      linksTab.push({
        id: index,
        label: t(LinksTrad[key]),
        href: links[key],
        linktype: LinkType.external,
        onClick: () => sendTrackClick(key),
      });
    });
    setLinksArray(linksTab);
  }, [links]);

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
