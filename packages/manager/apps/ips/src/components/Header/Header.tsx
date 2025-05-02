import React from 'react';
import {
  ChangelogButton,
  GuideButton,
  GuideItem,
} from '@ovh-ux/manager-react-components';
import { CHANGELOG_LINKS, useGuideUtils } from '@/utils';

export type Header = {
  title: string;
  changelogButton: JSX.Element;
  headerButton: JSX.Element;
};

export const useHeader = (title: string): Header => {
  const { guides } = useGuideUtils();

  const guideItems: GuideItem[] = guides.map((guide, index) => ({
    id: index,
    href: guide.href,
    target: '_blank',
    label: guide.texts.title,
  }));

  return {
    title,
    changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
    headerButton: <GuideButton items={guideItems} />,
  };
};
