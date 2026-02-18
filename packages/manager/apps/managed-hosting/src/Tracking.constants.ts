import { appName } from '@/App.constants';

export const LEVEL2 = {
  EU: { config: { level2: '84 - ManagerWeb' } },
  CA: { config: { level2: '84 - ManagerWeb' } },
  US: { config: { level2: '84 - ManagerWeb' } },
} as const;

export const UNIVERSE = 'Web' as const;
export const SUB_UNIVERSE = 'Web' as const;

export const APP_NAME = appName;

// MANAGED WORDPRESS
export const WORDPRESS_MANAGED = 'managed-wordpress';
export const WORDPRESS_MANAGED_SERVICE = 'managed-wordpress_service';
export const GENERAL_INFORMATION = 'general-information';
export const TASKS = 'tasks';
export const CREATE = 'create';
export const IMPORT = 'import';
export const DELETE = 'delete';
