import NotFound from '../pages/404.page';
import ErrorBoundary from '../components/error-boundary/ErrorBoundary.component';

const lazyLoadRoute = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();
      return {
        Component: moduleDefault,
        loader: moduleExports?.Loader,
        ErrorBoundary,
        handle: {
          breadcrumb: moduleExports.breadcrumb,
        },
        ...moduleExports,
      };
    },
  };
};

export const COMMON_PATH = '/pci/projects';
// Move to <Route /> config once the breadcrumb is supported there
export default [
  {
    path: '/pci/projects/:projectId/storages/objects',
    ...lazyLoadRoute(() => import('@/pages/Root.layout')),
    children: [
      {
        path: '',
        id: 'objects-storage',
        ...lazyLoadRoute(() =>
          import('@/pages/object-storage/ObjectStorage.layout'),
        ),
        children: [
          {
            path: '',
            id: 'objects-storage.storages',
            ...lazyLoadRoute(() =>
              import('@/pages/object-storage/storage/Storages.page'),
            ),
            children: [
              {
                path: 'switch-type/:containerId',
                id: 'storages.switch-type',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/switch-type/SwitchType.modal'
                  ),
                ),
              },
              {
                path: 'add-s3-user/:storageType/:storageId/:region',
                id: 'storages.add-s3-user',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/add-user-s3/AddUserS3.modal'
                  ),
                ),
              },
              {
                path: 'delete/:storageType/:storageId/:region',
                id: 'storages.delete',
                ...lazyLoadRoute(() =>
                  import('@/pages/object-storage/storage/delete/Delete.modal'),
                ),
              },
            ],
          },
          {
            path: 'users',
            id: 'objects-storage.users',
            ...lazyLoadRoute(() =>
              import('@/pages/object-storage/users/Users.page'),
            ),
            children: [
              {
                path: 'create',
                id: 'users.create',
                ...lazyLoadRoute(() =>
                  import('@/pages/object-storage/users/create/Create.modal'),
                ),
              },
              {
                path: 'user-secret/:userId',
                id: 'users.secret',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/users/show-secret/ShowSecretKey.modal'
                  ),
                ),
              },
              {
                path: 'rclone/:userId',
                id: 'users.rclone',
                ...lazyLoadRoute(() =>
                  import('@/pages/object-storage/users/rclone/Rclone.modal'),
                ),
              },
              {
                path: 'enable/:userId',
                id: 'users.enable',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/users/enableS3/EnableS3.modal'
                  ),
                ),
              },
              {
                path: 'disable/:userId',
                id: 'users.disable',
                ...lazyLoadRoute(() =>
                  import('@/pages/object-storage/users/delete/Delete.modal'),
                ),
              },
            ],
          },
        ],
      },
      {
        path: 'onboarding',
        id: 'onboarding',
        ...lazyLoadRoute(() =>
          import('@/pages/object-storage/onboarding/Onboarding.page'),
        ),
      },
      {
        path: 'new',
        id: 'create',
        ...lazyLoadRoute(() =>
          import('@/pages/object-storage/create/Create.page'),
        ),
      },
      // {
      //   path: ':serviceId',
      //   ...lazyLoadRoute(() =>
      //     import('@/pages/services/[serviceId]/Service.layout'),
      //   ),
      //   children: [
      //     {
      //       path: '',
      //       id: 'service.{service.engine}.dashboard',
      //       ...lazyLoadRoute(() =>
      //         import('@/pages/services/[serviceId]/dashboard/Dashboard.page'),
      //       ),
      //     },
      //   ],
      // },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
