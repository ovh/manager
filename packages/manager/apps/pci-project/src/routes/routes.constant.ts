// Route URLs
export const urls = {
  root: '/pci/projects',
  listing: '',
  project: ':projectId',
  home: '',
  edit: 'edit',
  activate: 'activate',
  onboarding: 'onboarding',
  creation: 'new',
  creating: 'creating/:orderId',
  creatingWithVoucher: 'creating/:orderId/:voucherCode',
  increaseQuota: 'increase-quota',
  remove: 'remove',
  contactsAndRights: ':projectId/contacts',
  contactAndRightsAdd: 'add',
  contactAndRightsDelete: 'delete/:accountId',
} as const;
