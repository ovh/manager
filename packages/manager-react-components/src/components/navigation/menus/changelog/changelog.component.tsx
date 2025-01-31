import React from 'react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsPopover, OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Links, LinkType } from '../../../typography';
import '../translations/translation';

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
        {Object.entries(links).map(([key, value]) => (
          <div key={key}>
            <Links
              href={value}
              target="_blank"
              type={LinkType.external}
              rel={LinkType.external}
              label={t(`mrc_changelog_${key}`)}
              onClickReturn={() =>
                trackClick({
                  actionType: 'navigation',
                  actions: [...chapters, ...CHANGELOG_PREFIXES, GO_TO(key)],
                })
              }
            />
          </div>
        ))}
      </OdsPopover>
    </>
  );
};

export default ChangelogButton;
