export const urls = {
  root: '',
  onboarding: '/onboarding',
  dashboard: '/:serviceName',
  overview: '/:serviceName',
  organizations: '/:serviceName/organizations',
  organizationsDelete: '/:serviceName/organizations/delete',
  domains: '/:serviceName/domains',
  domainsEdit: '/:serviceName/domains/edit',
  domainsDelete: '/:serviceName/domains/delete',
  domains_diagnostic_mx: '/:serviceName/domains/diagnostics/mx',
  domains_diagnostic_srv: '/:serviceName/domains/diagnostics/srv',
  domains_diagnostic_spf: '/:serviceName/domains/diagnostics/spf',
  domains_diagnostic_dkim: '/:serviceName/domains/diagnostics/dkim',
  email_accounts: '/:serviceName/email_accounts',
  email_accounts_add: '/:serviceName/email_accounts/add',
  email_accounts_edit: '/:serviceName/email_accounts/settings',
  email_accounts_alias: '/:serviceName/email_accounts/alias',
  email_accounts_alias_add: '/:serviceName/email_accounts/alias/add',
  email_accounts_alias_delete: '/:serviceName/email_accounts/alias/delete',
  email_accounts_redirections: '/:serviceName/email_accounts/redirections',
  email_accounts_redirections_add:
    '/:serviceName/email_accounts/redirections/add',
  email_accounts_redirections_edit:
    '/:serviceName/email_accounts/redirections/edit',
  email_accounts_redirections_delete:
    '/:serviceName/email_accounts/redirections/delete',
  email_accounts_auto_replies: '/:serviceName/email_accounts/auto_replies',
  email_accounts_auto_replies_add:
    '/:serviceName/email_accounts/auto_replies/add',
  email_accounts_auto_replies_delete:
    '/:serviceName/email_accounts/auto_replies/delete',
  mailing_lists: '/:serviceName/mailing_lists',
  mailing_lists_add: '/:serviceName/mailing_lists/add',
  mailing_lists_edit: '/:serviceName/mailing_lists/edit',
  mailing_lists_delete: '/:serviceName/mailing_lists/delete',
  mailing_lists_configure_delegation:
    '/:serviceName/mailing_lists/configure_delegation',
  mailing_lists_define_members: '/:serviceName/mailing_lists/define_members',
  redirections: '/:serviceName/redirections',
  redirections_add: '/:serviceName/redirections/add',
  redirections_edit: '/:serviceName/redirections/edit',
  redirections_delete: '/:serviceName/redirections/delete',
  auto_replies: '/:serviceName/auto_replies',
  auto_replies_delete: '/:serviceName/auto_replies/delete',
};
