import { appName } from '@/App.constants';

const ROOT_URL = `/`;

export const subRoutes = {
  serviceName: ':serviceName',
  onboarding: 'onboarding' as const,
} as const;

export const urls = {
  root: ROOT_URL,
  onboarding: `${ROOT_URL}${subRoutes.onboarding}`,
  managedWordpress: '/managed-hosting-for-wordpress',
  managedWordpressResource: `/managed-hosting-for-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceGeneralInformation: `/managed-hosting-for-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceCreate: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/create`,
  managedWordpressResourceImport: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/import`,
  managedWordpressResourceTasks: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/tasks`,
  managedWordpressResourceDeleteModal: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/delete-modal`,
} as const;

export const redirectionApp = appName;
