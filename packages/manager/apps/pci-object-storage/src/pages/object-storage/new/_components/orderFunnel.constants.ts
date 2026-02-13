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

export const STORAGE_LOCALISATION_LINKS: Record<string, string> = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047384',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0034723',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047380',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047381',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047388',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047396',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047393',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047389',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047382',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047393',
  IN:
    'https://help.ovhcloud.com/csm/en-in-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0069696',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047402',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047389',
  NL:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047384',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047390',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047391',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047387',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047394',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047389',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047389',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/10667991081107-Object-Storage-Endpoints-and-geoavailability',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047384',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047386',
};

export const STORAGE_OBJECT_LOCK_LINKS: Record<string, string> = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047399',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047392',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047408',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047400',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0034736',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047403',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047398',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047404',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047401',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047398',
  IN:
    'https://help.ovhcloud.com/csm/en-in-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0069687',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047405',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047404',
  NL:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047399',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047406',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047425',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047412',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047395',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047404',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047404',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/10694926634003-Managing-Object-Immutability-with-Object-Lock-WORM',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047399',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047410',
};

export const STORAGE_VERSIONING_LINKS: Record<string, string> = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063856',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063860',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063847',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063865',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063859',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063867',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063858',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063869',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063864',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063858',
  IN:
    'https://help.ovhcloud.com/csm/en-in-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0069702',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063866',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063869',
  NL:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063856',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063861',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063868',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063863',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063857',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063869',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063869',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/31431459806355-Object-Storage-Getting-started-with-versioning',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063856',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063862',
};

export const STORAGE_ACCESS_LOGS_LINKS: Record<string, string> = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056624',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056617',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056615',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056613',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056618',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056620',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056614',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056623',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056616',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056614',
  IN:
    'https://help.ovhcloud.com/csm/en-in-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0069699',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056621',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056623',
  NL:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056624',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056622',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056627',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056619',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056625',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056623',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056623',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/23888209235347-Object-Storage-Server-access-logging',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056624',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056626',
};

export const STORAGE_STATIC_WEBSITE_LINKS: Record<string, string> = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058067',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058059',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058069',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058058',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058063',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058072',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058068',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058095',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058056',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058068',
  IN:
    'https://help.ovhcloud.com/csm/en-in-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0069704',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058073',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058095',
  NL:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058067',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058071',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058061',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058096',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058066',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058095',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058095',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/17763186562451-Object-Storage-Hosting-a-static-website-in-an-Object-Storage-bucket',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058067',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058062',
};

export const STORAGE_LIFECYCLE_LINKS: Record<string, string> = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066009',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066011',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066012',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066015',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066013',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066016',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066017',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066010',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066014',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066017',
  IN:
    'https://help.ovhcloud.com/csm/en-in-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0069713',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066018',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066010',
  NL:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066009',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066019',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066020',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066021',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066022',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066010',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066010',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/32894387766419-Object-Storage-Manage-the-lifecycle-of-your-buckets',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066009',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-bucket-lifecycle?id=kb_article_view&sysparm_article=KB0066023',
};
