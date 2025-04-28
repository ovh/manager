export const urls = {
  root: '',
  onboarding: '/onboarding',
  onboarding_welcome: '/onboarding/welcome',
  onboarding_configure_organization:
    '/onboarding/configure/:platformId/organization',
  onboarding_configure_domain: '/onboarding/configure/:platformId/domain',
  onboarding_configure_email_accounts:
    '/onboarding/configure/:platformId/email_accounts',
  dashboard: '/:platformId',
  organizations: '/:platformId/organizations',
  organizationsDelete: '/:platformId/organizations/delete',
  domains: '/:platformId/domains',
  domainsEdit: '/:platformId/domains/:domainId/edit',
  domainsDelete: '/:platformId/domains/:domainId/delete',
  domains_diagnostic_mx: '/:platformId/domains/:domainId/diagnostics/mx',
  domains_diagnostic_srv: '/:platformId/domains/:domainId/diagnostics/srv',
  domains_diagnostic_spf: '/:platformId/domains/:domainId/diagnostics/spf',
  domains_diagnostic_dkim: '/:platformId/domains/:domainId/diagnostics/dkim',
  email_accounts: '/:platformId/email_accounts',
  email_accounts_add: '/:platformId/email_accounts/add',
  email_accounts_edit: '/:platformId/email_accounts/:accountId/settings',
  email_accounts_alias: '/:platformId/email_accounts/:accountId/aliases',
  email_accounts_alias_add:
    '/:platformId/email_accounts/:accountId/aliases/add',
  email_accounts_alias_delete:
    '/:platformId/email_accounts/:accountId/aliases/:aliasId/delete',
  email_accounts_redirections:
    '/:platformId/email_accounts/:accountId/redirections',
  email_accounts_redirections_add:
    '/:platformId/email_accounts/:accountId/redirections/add',
  email_accounts_redirections_edit:
    '/:platformId/email_accounts/:accountId/redirections/:redirectionId/edit',
  email_accounts_redirections_delete:
    '/:platformId/email_accounts/:accountId/redirections/:redirectionId/delete',
  email_accounts_auto_replies:
    '/:platformId/email_accounts/:accountId/auto_replies',
  email_accounts_auto_replies_add:
    '/:platformId/email_accounts/:accountId/auto_replies/add',
  email_accounts_auto_replies_delete:
    '/:platformId/email_accounts/:accountId/auto_replies/:autoReplyId/delete',
  mailing_lists: '/:platformId/mailing_lists',
  mailing_lists_add: '/:platformId/mailing_lists/add',
  mailing_lists_settings: '/:platformId/mailing_lists/:mailingListId/settings',
  mailing_lists_delete: '/:platformId/mailing_lists/:mailingListId/delete',
  mailing_lists_configure_delegation:
    '/:platformId/mailing_lists/:mailingListId/configure_delegation',
  mailing_lists_define_members:
    '/:platformId/mailing_lists/:mailingListId/define_members',
  redirections: '/:platformId/redirections',
  redirections_add: '/:platformId/redirections/add',
  redirections_edit: '/:platformId/redirections/edit',
  redirections_delete: '/:platformId/redirections/delete',
  auto_replies: '/:platformId/auto_replies',
  auto_replies_delete: '/:platformId/auto_replies/:autoReplyId/delete',
};
