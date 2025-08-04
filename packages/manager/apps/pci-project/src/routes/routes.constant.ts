// Route URLs
export const urls = {
  root: '/pci/projects',
  listing: '',
  project: ':projectId',
  home: '',
  edit: 'edit',
  onboarding: 'onboarding',
  creation: 'new',
  creating: 'creating/:orderId/:voucherCode',
  remove: 'remove',
} as const;

// Route IDs for React Router
export const ROUTE_IDS = {
  PROJECT: 'projectRoute',
} as const;

// Route data types
export type ProjectRouteData = { projectId: string };
