// Route URLs
export const urls = {
  root: '/pci/projects',
  listing: '',
  project: ':projectId',
  home: '',
  edit: 'edit',
  onboarding: 'onboarding',
  creation: 'new',
  increaseQuota: 'increase-quota',
  creating: 'creating/:orderId/:voucherCode',
  remove: 'remove',
} as const;
