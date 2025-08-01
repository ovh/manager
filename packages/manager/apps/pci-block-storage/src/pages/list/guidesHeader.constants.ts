import { GuidesHeader } from '@ovh-ux/manager-react-components';

export type Guide = Parameters<
  Parameters<typeof GuidesHeader>[0]['getGuideLabel']
>[0];

export const PUBLIC_CLOUD_STORAGE_GUIDES = {
  ASIA:
    'https://help.ovhcloud.com/csm/asia-documentation-public-cloud-compute-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=be8f534ba8f9a150476bc35f10bf9fce&spa=1',
  AU:
    'https://help.ovhcloud.com/csm/en-au-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  IN:
    'https://help.ovhcloud.com/csm/en-in-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  DE:
    'https://help.ovhcloud.com/csm/de-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  ES:
    'https://help.ovhcloud.com/csm/es-es-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  FR:
    'https://help.ovhcloud.com/csm/fr-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  IT:
    'https://help.ovhcloud.com/csm/it-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  MA:
    'https://help.ovhcloud.com/csm/fr-ma-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  SN:
    'https://help.ovhcloud.com/csm/fr-sn-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  TN:
    'https://help.ovhcloud.com/csm/fr-tn-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  NL:
    'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1 ',
  PL:
    'https://help.ovhcloud.com/csm/pl-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  PT:
    'https://help.ovhcloud.com/csm/pt-documentation-public-cloud-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=d334d555f49801102d4ca4d466a7fd7c&spa=1',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/sections/20495312447763-Block-Storage',
  WS:
    'https://help.ovhcloud.com/csm/es-documentation-public-cloud-storage-block-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=2f34d555f49801102d4ca4d466a7fd98&spa=1',
  DEFAULT:
    'https://support.us.ovhcloud.com/hc/en-us/sections/20495312447763-Block-Storage',
};

export const FIRST_STEPS_WITH_VOLUMES = {
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050603',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050605',
  CA:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050620',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050607',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050620',
  IN:
    'https://help.ovhcloud.com/csm/en-in-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0069217',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050611',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050608',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050613',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050624',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050626',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050624',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050624',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050624',
  NL:
    'https://help.ovhcloud.com/csm/en-nl-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050620',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050617',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050616',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050635',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/20566582694291-Creating-and-configuring-an-Additional-Disk-on-an-instance',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-compute-storage-additional-disk?id=kb_article_view&sysparm_article=KB0050622',
  DEFAULT:
    'https://support.us.ovhcloud.com/hc/en-us/articles/20566582694291-Creating-and-configuring-an-Additional-Disk-on-an-instance',
};

export const GUIDES: Record<string, Guide> = {
  all_block_storage_guides: {
    key: 'all_block_storage_guides',
    url: PUBLIC_CLOUD_STORAGE_GUIDES,
    tracking: '::guides::go_to_storage',
  },
  first_steps_with_volumes: {
    key: 'first_steps_with_volumes',
    url: FIRST_STEPS_WITH_VOLUMES,
    tracking: '::guides::go_to_volumes_guide',
  },
};
