import React, { useContext } from 'react';
import {
  ChangelogButton,
  GuideButton,
  GuideItem,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { CHANGELOG_LINKS, GUIDES_LIST } from '@/utils/links.constants';

export type Header = {
  title: string;
  changelogButton: JSX.Element;
  headerButton: JSX.Element;
};

export const useHeader = (title: string): Header => {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { t: tCommon } = useTranslation('common');
  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: (GUIDES_LIST.documentation_link.url[ovhSubsidiary] ||
        GUIDES_LIST.documentation_link.url.DEFAULT) as string,
      target: '_blank',
      label: tCommon('ips_dashboard_guide'),
    },
  ];

  return {
    title,
    changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
    headerButton: <GuideButton items={guideItems} />,
  };
};
