import { createContext } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';

export type GuideName = 'deployments-modes' | string;

export const GuideContext = createContext<
  { [Country in CountryCode]?: { [Name in GuideName]?: string } }
>({
  ASIA: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/asia-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066023',
  },
  AU: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/en-au-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066022',
  },
  CA: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/en-ca-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066032',
  },
  GB: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066027',
  },
  IE: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066035',
  },
  IN: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/asia-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066023',
  },
  SG: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/en-sg-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066026',
  },
  DE: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/de-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066036',
  },
  ES: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/es-es-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066024',
  },
  FR: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  },
  IT: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/it-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066033',
  },
  MA: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  },
  SN: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  },
  TN: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031',
  },
  NL: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066035',
  },
  PL: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/pl-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066030',
  },
  PT: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/pt-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066025',
  },
  QC: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/fr-ca-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066034',
  },
  US: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/en-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066029',
  },
  WS: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/es-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066028',
  },
  WE: {
    'deployments-modes':
      'https://help.ovhcloud.com/csm/en-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066029',
  },
});
