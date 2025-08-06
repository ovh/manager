// Route URLs
export const urls = {
  root: '/pci/projects',
  listing: '',
  project: ':projectId',
  home: '',
  edit: 'edit',
  onboarding: 'onboarding',
  creation: 'new',
  creating: 'creating/:orderId',
  creatingWithVoucher: 'creating/:orderId/:voucherCode',
  increaseQuota: 'increase-quota',
  remove: 'remove',
} as const;
