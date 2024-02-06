export const GATEWAY_IP_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;

export const SUBNET_DOC = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-kubernetes-known-limits?id=kb_article_view&sysparm_article=KB0049871#private-networks',
};

export default {
  GATEWAY_IP_REGEX,
  SUBNET_DOC,
};
