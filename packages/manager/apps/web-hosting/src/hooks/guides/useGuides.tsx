import { useContext } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type GuideUrls = {
  [key: string]: string;
  DEFAULT: string;
} & Partial<{ [key in CountryCode]: string }>;

export interface Guide {
  title: string;
  category?: string;
  description?: string;
  urls: GuideUrls;
  href?: string;
  tracking: string;
}

export const helpRoot = 'https://help.ovhcloud.com/csm/';

export const GUIDE_1: GuideUrls = {
  DEFAULT: `${helpRoot}`,
  FR: `${helpRoot}`,
  GB: `${helpRoot}`,
  DE: `${helpRoot}`,
  ES: `${helpRoot}`,
  IT: `${helpRoot}`,
  PL: `${helpRoot}`,
  PT: `${helpRoot}`,
  IE: `${helpRoot}`,
  MA: `${helpRoot}`,
  TN: `${helpRoot}`,
  SN: `${helpRoot}`,
};

export const GUIDE_2: GuideUrls = {
  DEFAULT: `${helpRoot}`,
  FR: `${helpRoot}`,
  GB: `${helpRoot}`,
  DE: `${helpRoot}`,
  ES: `${helpRoot}`,
  IT: `${helpRoot}`,
  PL: `${helpRoot}`,
  PT: `${helpRoot}`,
  IE: `${helpRoot}`,
  MA: `${helpRoot}`,
  TN: `${helpRoot}`,
  SN: `${helpRoot}`,
};

export const GUIDE_3: GuideUrls = {
  DEFAULT: `${helpRoot}`,
  FR: `${helpRoot}`,
  GB: `${helpRoot}`,
  DE: `${helpRoot}`,
  ES: `${helpRoot}`,
  IT: `${helpRoot}`,
  PL: `${helpRoot}`,
  PT: `${helpRoot}`,
  IE: `${helpRoot}`,
  MA: `${helpRoot}`,
  TN: `${helpRoot}`,
  SN: `${helpRoot}`,
};

export const GUIDE_LIST: Record<string, Guide> = {
  guideLink1: {
    title: 'guide1Title',
    description: 'guide1Description',
    category: 'guideCategory',
    urls: GUIDE_1,
    tracking: '',
  },
  guideLink2: {
    title: 'guide2Title',
    description: 'guide2Description',
    category: 'guideCategory',
    urls: GUIDE_2,
    tracking: '',
  },
  guideLink3: {
    title: 'guide3Title',
    description: 'guide3Description',
    category: 'guideCategory',
    urls: GUIDE_3,
    tracking: '',
  },
};

/* eslint-disable no-param-reassign */
export const useGuides = () => {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  return Object.entries(GUIDE_LIST).reduce((list, [key, value]) => {
    list[key] = {
      ...value,
      href: value.urls[ovhSubsidiary] || value.urls.DEFAULT || 'to_be_defined',
    };
    return list;
  }, {} as Record<string, Guide>);
};
/* eslint-enable no-param-reassign */

export default useGuides;
