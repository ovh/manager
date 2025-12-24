import React from 'react';

import {
  ChangelogButton,
  GuideButton,
  GuideItem,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { CHANGELOG_LINKS, useGuideUtils } from '@/utils';

export type Header = {
  title: string;
  changelogButton: JSX.Element;
  headerButton: JSX.Element;
};

export const useHeader = (title: string): Header => {
  const { guides } = useGuideUtils();
  const { trackClick } = useOvhTracking();

  const guideItems: GuideItem[] = guides.map((guide, index) => ({
    id: index,
    href: guide.href,
    target: '_blank',
    label: guide.texts.title,
    onClick: () => {
      trackClick({
        buttonType: ButtonType.externalLink,
        actionType: 'action',
        location: PageLocation.tile,
        actions: [`go-to_${guide.trackingLabel}`],
      });
    },
  }));

  return {
    title,
    changelogButton: (
      <ChangelogButton chapters={['network::ip::ip']} links={CHANGELOG_LINKS} />
    ),
    headerButton: <GuideButton items={guideItems} />,
  };
};
