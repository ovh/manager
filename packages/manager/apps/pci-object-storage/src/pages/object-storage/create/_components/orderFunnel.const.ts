import { useUser } from '@/hooks/useUser';

export enum ObjectContainerOffers {
  's3-standard' = 'storage-s3-standard',
  'swift' = 'storage',
}
export const PLAN_CODES: Record<ObjectContainerOffers, string> = {
  [ObjectContainerOffers['s3-standard']]: 'storage-standard',
  [ObjectContainerOffers.swift]: 'storage',
};
export const useLink = (links: Record<string, string>) => {
  const user = useUser();
  return links[user?.ovhSubsidiary] ?? links.DEFAULT;
};
export const STORAGE_PRICES_LINK: Record<string, string> = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices/#439',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/prices/#439',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/prices/#439',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices/#439',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices/#439',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices/#439',
  EU: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#439',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/#439',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/#439',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#439',
  IN: 'https://www.ovhcloud.com/en-in/public-cloud/prices/#439',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices/#439',
  MA: 'https://www.ovhcloud.com/fr/public-cloud/prices/#439',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices/#439',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/#439',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/#439',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices/#439',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/prices/#439',
  SN: 'https://www.ovhcloud.com/fr/public-cloud/prices/#439',
  TN: 'https://www.ovhcloud.com/fr/public-cloud/prices/#439',
  US: 'https://us.ovhcloud.com/public-cloud/prices/#439',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices/#439',
  WS: 'https://www.ovhcloud.com/es/public-cloud/prices/#439',
};
export const STORAGE_ASYNC_REPLICATION_LINK: Record<string, string> = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062417',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062424',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062420',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062423',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062426',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062427',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062415',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062418',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062422',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062415',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062424',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062425',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062418',
  NL:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062417',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062421',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062414',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062413',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062416',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062418',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062418',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/34270032176019-Object-Storage-Master-asynchronous-replication-across-your-buckets',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062417',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062419',
};
