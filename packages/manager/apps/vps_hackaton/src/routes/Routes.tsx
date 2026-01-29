import type { RouteObject } from 'react-router-dom';
import { ROUTES } from './Routes.constants';
import { lazyRouteConfig } from './Routes.utils';

export const routes: Array<RouteObject> = [
  {
    path: ROUTES.ROOT,
    ...lazyRouteConfig(() => import('@/pages/VpsList/VpsList.page')),
  },
  {
    path: ROUTES.VPS_DETAIL,
    ...lazyRouteConfig(() => import('@/pages/VpsDetail/VpsDetail.page')),
    children: [
      {
        index: true,
        ...lazyRouteConfig(
          () => import('@/pages/VpsDetail/Dashboard/Dashboard.page'),
        ),
      },
      {
        path: ROUTES.SNAPSHOT,
        ...lazyRouteConfig(
          () => import('@/pages/VpsDetail/Snapshot/Snapshot.page'),
        ),
      },
      {
        path: ROUTES.VEEAM,
        ...lazyRouteConfig(() => import('@/pages/VpsDetail/Veeam/Veeam.page')),
      },
      {
        path: ROUTES.BACKUP_STORAGE,
        ...lazyRouteConfig(
          () => import('@/pages/VpsDetail/BackupStorage/BackupStorage.page'),
        ),
      },
      {
        path: ROUTES.MONITORING,
        ...lazyRouteConfig(
          () => import('@/pages/VpsDetail/Monitoring/Monitoring.page'),
        ),
      },
      {
        path: ROUTES.MIGRATION,
        ...lazyRouteConfig(
          () => import('@/pages/VpsDetail/Migration/Migration.page'),
        ),
      },
    ],
  },
];
