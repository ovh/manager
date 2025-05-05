export const MOUNT_POINTS = 'defghijklmnopqrstuvwxyza';
export const MAX_MOUNT_POINTS = 24;

export const TEMPLATE_OS_SOFTWARE_RAID_LIST = {
  1: [0],
  2: [0, 1],
  3: [0, 1, 5],
  4: [0, 1, 5, 10],
  5: [0, 1, 5, 6, 10],
  6: [0, 1, 5, 6, 10],
  7: [0, 1, 5, 6, 7, 10],
};

export const REINSTALL_API_CONSOLE_LINK = {
  EU:
    'https://eu.api.ovh.com/console/?section=%2Fdedicated%2Fserver&branch=v1#post-/dedicated/server/-serviceName-/reinstall',
  CA:
    'https://ca.api.ovh.com/console/?section=%2Fdedicated%2Fserver&branch=v1#post-/dedicated/server/-serviceName-/reinstall',
  US:
    'https://api.us.ovhcloud.com/console/?section=%2Fdedicated%2Fserver&branch=v1#post-/dedicated/server/-serviceName-/reinstall',
};

export const API_OS_INSTALLATION_DOCUMENTATION_LINK = {
  ASIA:
    'https://help.ovhcloud.com/csm/asia-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061947',
  AU:
    'https://help.ovhcloud.com/csm/en-au-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061949',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061946',
  DE:
    'https://help.ovhcloud.com/csm/de-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061952',
  ES:
    'https://help.ovhcloud.com/csm/es-es-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061954',
  FR:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061958',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061945',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061950',
  IN:
    'https://help.ovhcloud.com/csm/asia-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061947',
  IT:
    'https://help.ovhcloud.com/csm/it-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061956',
  MA:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061958',
  PL:
    'https://help.ovhcloud.com/csm/pl-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061957',
  PT:
    'https://help.ovhcloud.com/csm/pt-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061959',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061953',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061948',
  SN:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061958',
  TN:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061958',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/27030860979859-OVHcloud-API-and-OS-Installation',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061950',
  WS:
    'https://help.ovhcloud.com/csm/es-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061954',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-dedicated-servers-api-os-installation?id=kb_article_view&sysparm_article=KB0061951',
};

export const EOL_PERSONAL_INSTALLATION_TEMPLATES_DOCUMENTATION_LINK = {
  ASIA:
    'https://help.ovhcloud.com/csm/asia-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067548',
  AU:
    'https://help.ovhcloud.com/csm/en-au-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067549',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067550',
  DE:
    'https://help.ovhcloud.com/csm/de-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067553',
  ES:
    'https://help.ovhcloud.com/csm/es-es-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067552',
  FR:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067558',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067551',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067555',
  IN:
    'https://help.ovhcloud.com/csm/asia-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067548',
  IT:
    'https://help.ovhcloud.com/csm/it-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067559',
  MA:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067558',
  PL:
    'https://help.ovhcloud.com/csm/pl-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067562',
  PT:
    'https://help.ovhcloud.com/csm/pt-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067556',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067554',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067561',
  SN:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067558',
  TN:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067558',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/40842755153171-End-of-life-for-personal-installation-templates',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067555',
  WS:
    'https://help.ovhcloud.com/csm/es-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067552',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-dedicated-servers-end-of-life-for-personal-installation-templates?id=kb_article_view&sysparm_article=KB0067557',
};

export default {
  MOUNT_POINTS,
  MAX_MOUNT_POINTS,
  TEMPLATE_OS_SOFTWARE_RAID_LIST,
  REINSTALL_API_CONSOLE_LINK,
  API_OS_INSTALLATION_DOCUMENTATION_LINK,
  EOL_PERSONAL_INSTALLATION_TEMPLATES_DOCUMENTATION_LINK,
};
