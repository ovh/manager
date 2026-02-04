import { Navigate } from 'react-router-dom';
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
        id: 'object-storage',
        ...lazyLoadRoute(() =>
          import('@/pages/object-storage/ObjectStorage.layout'),
        ),
        children: [
          {
            path: '',
            id: 'storages',
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
                path: 'delete/:storageId/:region',
                id: 's3.delete',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/deleteS3/DeleteS3.modal'
                  ),
                ),
              },
              {
                path: 'delete/:swiftId',
                id: 'swift.delete',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/deleteSwift/DeleteSwift.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'users',
            id: 'users',
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
                path: 'import-policy/:userId',
                id: 'users.import-policy',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/users/import-policy/ImportPolicy.modal'
                  ),
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
      {
        path: 'swift/:swiftId',
        ...lazyLoadRoute(() =>
          import('@/pages/object-storage/storage/swiftId/Swift.layout'),
        ),
        children: [
          {
            path: '',
            id: 'swift.dashboard',
            ...lazyLoadRoute(() =>
              import(
                '@/pages/object-storage/storage/swiftId/dashboard/Dashboard.page'
              ),
            ),
            children: [
              {
                path: 'delete',
                id: 'swift.dashboard.delete',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/swiftId/dashboard/delete/Delete.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'objects',
            id: 'swift.dashboard.objects',
            ...lazyLoadRoute(() =>
              import(
                '@/pages/object-storage/storage/swiftId/objects/Objects.page'
              ),
            ),
            children: [
              {
                path: 'delete-object',
                id: 'swift.dashboard.objects.delete',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/swiftId/objects/delete/DeleteObject.modal'
                  ),
                ),
              },
              {
                path: 'add-object',
                id: 'swift.dashboard.objects.add',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/swiftId/objects/add/Add.modal'
                  ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: 's3/:region/:s3Name',
        ...lazyLoadRoute(() =>
          import('@/pages/object-storage/storage/s3Id/S3.layout'),
        ),
        children: [
          {
            index: true,
            element: <Navigate to="objects" />,
          },
          {
            path: 'objects',
            ...lazyLoadRoute(() =>
              import(
                '@/pages/object-storage/storage/s3Id/objects/Objects.layout'
              ),
            ),
            children: [
              {
                path: '',
                id: 's3.objects.list',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/objects/Objects.page'
                  ),
                ),
                children: [
                  {
                    path: 'add-object',
                    id: 's3.objects.add',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/storage/s3Id/objects/add/Add.modal'
                      ),
                    ),
                  },
                  {
                    path: 'restore-object',
                    id: 's3.objects.restore',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/storage/s3Id/objects/restore/Restore.modal'
                      ),
                    ),
                  },
                  {
                    path: 'delete-object',
                    id: 's3.objects.delete',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/storage/s3Id/objects/delete/DeleteObject.modal'
                      ),
                    ),
                  },
                  {
                    path: 'delete-version/:versionId',
                    id: 's3.object.version.delete',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/storage/s3Id/objects/object/versions/delete/DeleteObjectVersion.modal'
                      ),
                    ),
                  },
                  {
                    path: 'bulk-delete',
                    id: 's3.objects.bulk-delete',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/storage/s3Id/objects/bulk-delete/BulkDeleteObjects.modal'
                      ),
                    ),
                  },
                ],
              },
              {
                path: 'object',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/objects/object/Object.layout'
                  ),
                ),
                children: [
                  {
                    path: '',
                    id: 's3.object.dashboard',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/storage/s3Id/objects/object/Object.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'change-storage-class',
                        id: 's3.object.change-storage-class',
                        ...lazyLoadRoute(() =>
                          import(
                            '@/pages/object-storage/storage/s3Id/objects/object/change-storage-class/ChangeStorageClass.modal'
                          ),
                        ),
                      },
                      {
                        path: 'delete-object',
                        id: 's3.object.delete',
                        ...lazyLoadRoute(() =>
                          import(
                            '@/pages/object-storage/storage/s3Id/objects/delete/DeleteObject.modal'
                          ),
                        ),
                      },
                      {
                        path: 'restore-object',
                        id: 's3.object.restore',
                        ...lazyLoadRoute(() =>
                          import(
                            '@/pages/object-storage/storage/s3Id/objects/object/restore/Restore.modal'
                          ),
                        ),
                      },
                    ],
                  },
                  {
                    path: 'versions',
                    id: 's3.object.versions',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/storage/s3Id/objects/object/versions/Versions.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'delete-version/:versionId',
                        id: 'versions.delete',
                        ...lazyLoadRoute(() =>
                          import(
                            '@/pages/object-storage/storage/s3Id/objects/object/versions/delete/DeleteObjectVersion.modal'
                          ),
                        ),
                      },
                      {
                        path: 'bulk-delete',
                        id: 'versions.bulk-delete',
                        ...lazyLoadRoute(() =>
                          import(
                            '@/pages/object-storage/storage/s3Id/objects/bulk-delete/BulkDeleteObjects.modal'
                          ),
                        ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: 'dashboard',
            id: 's3.dashboard.properties',
            ...lazyLoadRoute(() =>
              import(
                '@/pages/object-storage/storage/s3Id/dashboard/Dashboard.page'
              ),
            ),
            children: [
              {
                path: 'delete',
                id: 's3.dashboard.delete',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/dashboard/delete/Delete.modal'
                  ),
                ),
              },
              {
                path: 'active-encryption',
                id: 'settings.encryption',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/dashboard/_components/activate-encryption/ActivateEncryption.modal'
                  ),
                ),
              },
              {
                path: 'active-versionning',
                id: 'settings.versionning',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/dashboard/_components/activate-versionning/ActivateVersionning.modal'
                  ),
                ),
              },
              {
                path: 'object-lock-options',
                id: 'settings.object-lock',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/dashboard/_components/object-lock-options/ObjectLockOptions.sheet'
                  ),
                ),
              },
            ],
          },
          {
            path: 'replication',
            id: 's3.dashboard.replication',
            ...lazyLoadRoute(() =>
              import(
                '@/pages/object-storage/storage/s3Id/replication/Replication.page'
              ),
            ),
            children: [
              {
                id: 'replication.list',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/replication/list/List.page'
                  ),
                ),
                children: [
                  {
                    index: true,
                  },
                  {
                    path: 'delete/:ruleId',
                    id: 'replication.delete',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/storage/s3Id/replication/delete/Delete.modal'
                      ),
                    ),
                  },
                ],
              },
              {
                path: 'new',
                id: 'replication.new',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/replication/new/New.page'
                  ),
                ),
              },
              {
                path: 'edit/:ruleId',
                id: 'replication.edit',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/replication/edit/Edit.page'
                  ),
                ),
              },
              {
                path: 'storage-job',
                id: 'replication.storage-job',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/replication/storage-job/StorageJob.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'lifecycle',
            id: 's3.dashboard.lifecycle',
            ...lazyLoadRoute(() =>
              import(
                '@/pages/object-storage/storage/s3Id/lifecycle/Lifecycle.page'
              ),
            ),
            children: [
              {
                id: 'lifecycle.list',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/storage/s3Id/lifecycle/list/List.page'
                  ),
                ),
                children: [
                  {
                    index: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
