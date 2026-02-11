import { OvhSubsidiary } from '@ovh-ux/muk';

type GuideLinks = { [key in OvhSubsidiary]: string };

export const RANCHER_GUIDES_URL: Partial<GuideLinks> = {
  FR:
    'https://help.ovhcloud.com/csm/fr-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  DEFAULT:
    'https://help.ovhcloud.com/csm/worldeuro-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  DE:
    'https://help.ovhcloud.com/csm/de-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  ES:
    'https://help.ovhcloud.com/csm/es-es-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  EU:
    'https://help.ovhcloud.com/csm/worldeuro-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  IN:
    'https://help.ovhcloud.com/csm/en-in-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  IT:
    'https://help.ovhcloud.com/csm/it-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  MA:
    'https://help.ovhcloud.com/csm/fr-ma-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  NL:
    'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  PL:
    'https://help.ovhcloud.com/csm/pl-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  PT:
    'https://help.ovhcloud.com/csm/pt-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  SN:
    'https://help.ovhcloud.com/csm/fr-sn-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  TN:
    'https://help.ovhcloud.com/csm/fr-tn-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  US:
    'https://help.ovhcloud.com/csm/en-us-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  WE:
    'https://help.ovhcloud.com/csm/worldeuro-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  WS:
    'https://help.ovhcloud.com/csm/world-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  AU:
    'https://help.ovhcloud.com/csm/en-au-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-documentation-public-cloud-containers-orchestration-managed-rancher-service?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=ba1cdc8ff1a082502d4cea09e7c8beb9&spa=1',
};
