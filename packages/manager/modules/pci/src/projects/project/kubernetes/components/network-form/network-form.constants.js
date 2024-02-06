export const GATEWAY_IP_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;

export const SUBNET_DOC = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049871#private-networks',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055207',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055208',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055211',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049871',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055212',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055213',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055215',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049884',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049868',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0055209',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/1500005048361-Managed-Kubernetes-Known-Limits',
};

export default {
  GATEWAY_IP_REGEX,
  SUBNET_DOC,
};
