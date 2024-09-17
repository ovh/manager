export const urls = {
  root: '',
  onboarding: '/onboarding',
  dashboard: '/:serviceName',
  overview: '/:serviceName',
  organizations: '/:serviceName/organizations',
  organizationsDelete: '/:serviceName/organizations/delete',
  domains: '/:serviceName/domains',
  domains_diagnostic: '/:serviceName/domains/diagnostic',
  email_accounts: '/:serviceName/email_accounts',
  email_accounts_add: '/:serviceName/email_accounts/add',
  email_accounts_edit: '/:serviceName/email_accounts/settings',
  email_accounts_alias: '/:serviceName/email_accounts/alias',
  email_accounts_alias_add: '/:serviceName/email_accounts/alias/add',
  email_accounts_alias_delete: '/:serviceName/email_accounts/alias/delete',
  mailing_lists: '/:serviceName/mailing_lists',
  mailing_lists_add: '/:serviceName/mailing_lists/add',
  mailing_lists_edit: '/:serviceName/mailing_lists/edit',
  mailing_lists_delete: '/:serviceName/mailing_lists/delete',
  mailing_lists_configure_delegation:
    '/:serviceName/mailing_lists/configure_delegation',
  mailing_lists_define_members: '/:serviceName/mailing_lists/define_members',
  redirections: '/:serviceName/redirections',
};
