import { useContext } from 'react';

import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import * as tracking from '@/utils/tracking.constants';

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

export const GUIDE_GETTING_STARTED: GuideUrls = {
  DEFAULT: `${helpRoot}en-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052763`,
  FR: `${helpRoot}fr-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052770`,
  GB: `${helpRoot}en-gb-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052775`,
  DE: `${helpRoot}de-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0040789`,
  ES: `${helpRoot}es-es-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052768`,
  IT: `${helpRoot}it-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052767`,
  PL: `${helpRoot}pl-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052772`,
  PT: `${helpRoot}pt-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052773`,
  IE: `${helpRoot}en-ie-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052774`,
  NL: `${helpRoot}en-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052779`,
  AU: `${helpRoot}en-au-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052760`,
  CA: `${helpRoot}en-ca-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052761`,
  QC: `${helpRoot}fr-ca-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052764`,
  ASIA: `${helpRoot}asia-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052756`,
  MA: `${helpRoot}fr-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052770`,
  TN: `${helpRoot}fr-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052770`,
  SN: `${helpRoot}fr-web-hosting-getting-started?id=kb_article_view&sysparm_article=KB0052770`,
};

export const GUIDE_PUBLISHING: GuideUrls = {
  DEFAULT: `${helpRoot}en-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052779`,
  FR: `${helpRoot}fr-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052788`,
  GB: `${helpRoot}en-gb-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052776`,
  DE: `${helpRoot}de-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052782`,
  ES: `${helpRoot}es-es-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052781`,
  IT: `${helpRoot}it-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052783`,
  PL: `${helpRoot}pl-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052784`,
  PT: `${helpRoot}pt-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052785`,
  IE: `${helpRoot}en-ie-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052778`,
  NL: `${helpRoot}en-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052779`,
  AU: `${helpRoot}en-au-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052769`,
  CA: `${helpRoot}en-ca-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0040803`,
  QC: `${helpRoot}fr-ca-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052792`,
  ASIA: `${helpRoot}asia-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052771`,
  MA: `${helpRoot}fr-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052788`,
  TN: `${helpRoot}fr-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052788`,
  SN: `${helpRoot}fr-web-hosting-publishing-website?id=kb_article_view&sysparm_article=KB0052788`,
};

export const GUIDE_EDIT_DNS_ZONE: GuideUrls = {
  DEFAULT: `${helpRoot}en-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051682`,
  FR: `${helpRoot}fr-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051684`,
  GB: `${helpRoot}en-gb-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0039608`,
  DE: `${helpRoot}de-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051668`,
  ES: `${helpRoot}es-es-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051692`,
  IT: `${helpRoot}it-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051687`,
  PL: `${helpRoot}pl-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051689`,
  PT: `${helpRoot}pt-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051694`,
  IE: `${helpRoot}en-ie-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051685`,
  NL: `${helpRoot}en-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051682`,
  AU: `${helpRoot}en-au-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051673`,
  CA: `${helpRoot}en-ca-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051675`,
  QC: `${helpRoot}fr-ca-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051686`,
  ASIA: `${helpRoot}asia-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051672`,
  MA: `${helpRoot}fr-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051684`,
  TN: `${helpRoot}fr-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051684`,
  SN: `${helpRoot}fr-dns-edit-dns-zone?id=kb_article_view&sysparm_article=KB0051684`,
};

export const GUIDE_LIST: Record<string, Guide> = {
  guideLink1: {
    title: 'guide_1_title',
    description: 'guide_1_description',
    category: 'guide_category',
    urls: GUIDE_GETTING_STARTED,
    tracking: tracking.GUIDE_GETTING_STARTED,
  },
  guideLink2: {
    title: 'guide_2_title',
    description: 'guide_2_description',
    category: 'guide_category',
    urls: GUIDE_PUBLISHING,
    tracking: tracking.GUIDE_PUBLISHING,
  },
  guideLink3: {
    title: 'guide_3_title',
    description: 'guide_3_description',
    category: 'guide_category',
    urls: GUIDE_EDIT_DNS_ZONE,
    tracking: tracking.GUIDE_EDIT_DNS_ZONE,
  },
};

export const useGuides = () => {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  return Object.entries(GUIDE_LIST).reduce(
    (list, [key, value]) => {
      return {
        ...list,
        [key]: {
          ...value,
          href: value.urls[ovhSubsidiary] || value.urls.DEFAULT,
        },
      };
    },
    {} as Record<string, Guide>,
  );
};

export default useGuides;
