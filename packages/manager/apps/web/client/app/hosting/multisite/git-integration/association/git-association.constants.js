export const REPOSITORY_PLACEHOLDER =
  'https://github.com/username/repositoryname';
export const EXAMPLE_HTTPS_REPOSITORY_URL =
  'https://github.com/username/respositoryname.git';
export const EXAMPLE_SSH_REPOSITORY_URL =
  'git@github.com:username/respositoryname.git';
export const EXAMPLE_BRANCHES_NAMES = '"main", "master", ...';
export const GITHUB_VCS = 'github';
export const REGEX_GIT_REPO = /^(https:\/\/github.com\/[^/]+\/.+\.git|git@github.com:[^/]+\/.+\.git)$/;

export const GIT_ASSOCIATION_GUIDE_LINK = {
  DE:
    'https://help.ovhcloud.com/csm/de-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063761',
  ES:
    'https://help.ovhcloud.com/csm/es-es-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063758',
  FR:
    'https://help.ovhcloud.com/csm/fr-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063755',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063757',
  IT:
    'https://help.ovhcloud.com/csm/it-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063763',
  NL:
    'https://help.ovhcloud.com/csm/en-ie-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063757',
  PL:
    'https://help.ovhcloud.com/csm/pl-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063765',
  PT:
    'https://help.ovhcloud.com/csm/pt-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063752',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063762',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063759',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063764',
  MA:
    'https://help.ovhcloud.com/csm/fr-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063755',
  SN:
    'https://help.ovhcloud.com/csm/fr-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063755',
  TN:
    'https://help.ovhcloud.com/csm/fr-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063755',
  AU:
    'https://help.ovhcloud.com/csm/en-au-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063766',
  IN:
    'https://help.ovhcloud.com/csm/asia-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063756',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063753',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063756',
  WE:
    'https://help.ovhcloud.com/csm/en-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063754',
  WS:
    'https://help.ovhcloud.com/csm/es-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063760',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063754',
};

const PREFIX_GITHUB_DOCS_URL = 'https://docs.github.com/';
const SUFFIX_GITHUB_WEBHOOK_DOCS_URL =
  '/apps/github-marketplace/listing-an-app-on-github-marketplace/configuring-a-webhook-to-notify-you-of-plan-changes';
export const GIT_WEBHOOK_GUIDE_LINK = {
  DE: `${PREFIX_GITHUB_DOCS_URL}de${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  ES: `${PREFIX_GITHUB_DOCS_URL}es${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  FR: `${PREFIX_GITHUB_DOCS_URL}fr${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  QC: `${PREFIX_GITHUB_DOCS_URL}fr${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  MA: `${PREFIX_GITHUB_DOCS_URL}fr${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  SN: `${PREFIX_GITHUB_DOCS_URL}fr${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  TN: `${PREFIX_GITHUB_DOCS_URL}fr${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  WS: `${PREFIX_GITHUB_DOCS_URL}es${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
  DEFAULT: `${PREFIX_GITHUB_DOCS_URL}en${SUFFIX_GITHUB_WEBHOOK_DOCS_URL}`,
};

export default {
  REPOSITORY_PLACEHOLDER,
  EXAMPLE_HTTPS_REPOSITORY_URL,
  EXAMPLE_BRANCHES_NAMES,
  EXAMPLE_SSH_REPOSITORY_URL,
  GITHUB_VCS,
  REGEX_GIT_REPO,
  GIT_ASSOCIATION_GUIDE_LINK,
  GIT_WEBHOOK_GUIDE_LINK,
};
