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
    ...lazyLoadRoute(() => import('@/pages/object-storage/Root.layout')),
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
              import('@/pages/object-storage/ListObjectStorages.page'),
            ),
            children: [
              {
                path: 'switch-type/:containerId',
                id: 'storages.switch-type',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/switch-type/[containerId]/SwitchType.modal'
                  ),
                ),
              },
              {
                path: 'add-s3-user/:storageType/:storageId/:region',
                id: 'storages.add-s3-user',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/add-s3-user/[storageType]/[storageId]/[region]/AddUserS3.modal'
                  ),
                ),
              },
              {
                path: 'delete/:storageId/:region',
                id: 's3.delete',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/delete/[storageId]/[region]/DeleteS3.modal'
                  ),
                ),
              },
              {
                path: 'delete/:swiftId',
                id: 'swift.delete',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/delete/[swiftId]/DeleteSwift.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'users',
            id: 'users',
            ...lazyLoadRoute(() =>
              import('@/pages/object-storage/users/ListUsers.page'),
            ),
            children: [
              {
                path: 'create',
                id: 'users.create',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/users/create/CreateUser.modal'
                  ),
                ),
              },
              {
                path: 'user-secret/:userId',
                id: 'users.secret',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/users/user-secret/[userId]/ShowSecretKey.modal'
                  ),
                ),
              },
              {
                path: 'rclone/:userId',
                id: 'users.rclone',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/users/rclone/[userId]/Rclone.modal'
                  ),
                ),
              },
              {
                path: 'import-policy/:userId',
                id: 'users.import-policy',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/users/import-policy/[userId]/ImportPolicy.modal'
                  ),
                ),
              },
              {
                path: 'enable/:userId',
                id: 'users.enable',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/users/enable/EnableUserS3.modal'
                  ),
                ),
              },
              {
                path: 'disable/:userId',
                id: 'users.disable',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/users/disable/DisableUser.modal'
                  ),
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
          import('@/pages/object-storage/new/CreateObjectStorage.page'),
        ),
      },
      {
        path: 'swift/:swiftId',
        ...lazyLoadRoute(() =>
          import('@/pages/object-storage/swift/[swiftId]/Swift.layout'),
        ),
        children: [
          {
            path: '',
            id: 'swift.dashboard',
            ...lazyLoadRoute(() =>
              import(
                '@/pages/object-storage/swift/[swiftId]/dashboard/SwiftDashboard.page'
              ),
            ),
            children: [
              {
                path: 'delete',
                id: 'swift.dashboard.delete',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/swift/[swiftId]/dashboard/delete/DeleteSwiftStorage.modal'
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
                '@/pages/object-storage/swift/[swiftId]/objects/ListSwiftObjects.page'
              ),
            ),
            children: [
              {
                path: 'delete-object',
                id: 'swift.dashboard.objects.delete',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/swift/[swiftId]/objects/delete/DeleteSwiftObject.modal'
                  ),
                ),
              },
              {
                path: 'add-object',
                id: 'swift.dashboard.objects.add',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/swift/[swiftId]/objects/add/AddSwiftObject.modal'
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
          import('@/pages/object-storage/s3/[region]/[s3Name]/S3.layout'),
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
                '@/pages/object-storage/s3/[region]/[s3Name]/objects/S3Objects.layout'
              ),
            ),
            children: [
              {
                path: '',
                id: 's3.objects.list',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/s3/[region]/[s3Name]/objects/ListS3Objects.page'
                  ),
                ),
                children: [
                  {
                    path: 'add-object',
                    id: 's3.objects.add',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/s3/[region]/[s3Name]/objects/add/AddS3Object.modal'
                      ),
                    ),
                  },
                  {
                    path: 'restore-object',
                    id: 's3.objects.restore',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/s3/[region]/[s3Name]/objects/restore/RestoreS3ObjectFromList.modal'
                      ),
                    ),
                  },
                  {
                    path: 'delete-object',
                    id: 's3.objects.delete',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/s3/[region]/[s3Name]/objects/delete/DeleteS3Object.modal'
                      ),
                    ),
                  },
                  {
                    path: 'delete-version/:versionId',
                    id: 's3.object.version.delete',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/s3/[region]/[s3Name]/objects/object/versions/delete/DeleteS3ObjectVersion.modal'
                      ),
                    ),
                  },
                  {
                    path: 'bulk-delete',
                    id: 's3.objects.bulk-delete',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/s3/[region]/[s3Name]/objects/bulk-delete/BulkDeleteS3Objects.modal'
                      ),
                    ),
                  },
                ],
              },
              {
                path: 'object',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/s3/[region]/[s3Name]/objects/object/S3Object.layout'
                  ),
                ),
                children: [
                  {
                    path: '',
                    id: 's3.object.dashboard',
                    ...lazyLoadRoute(() =>
                      import(
                        '@/pages/object-storage/s3/[region]/[s3Name]/objects/object/S3Object.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'change-storage-class',
                        id: 's3.object.change-storage-class',
                        ...lazyLoadRoute(() =>
                          import(
                            '@/pages/object-storage/s3/[region]/[s3Name]/objects/object/change-storage-class/ChangeS3ObjectStorageClass.modal'
                          ),
                        ),
                      },
                      {
                        path: 'delete-object',
                        id: 's3.object.delete',
                        ...lazyLoadRoute(() =>
                          import(
                            '@/pages/object-storage/s3/[region]/[s3Name]/objects/delete/DeleteS3Object.modal'
                          ),
                        ),
                      },
                      {
                        path: 'restore-object',
                        id: 's3.object.restore',
                        ...lazyLoadRoute(() =>
                          import(
                            '@/pages/object-storage/s3/[region]/[s3Name]/objects/object/restore/RestoreS3Object.modal'
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
                        '@/pages/object-storage/s3/[region]/[s3Name]/objects/object/versions/S3ObjectVersions.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'delete-version/:versionId',
                        id: 'versions.delete',
                        ...lazyLoadRoute(() =>
                          import(
                            '@/pages/object-storage/s3/[region]/[s3Name]/objects/object/versions/delete/DeleteS3ObjectVersion.modal'
                          ),
                        ),
                      },
                      {
                        path: 'bulk-delete',
                        id: 'versions.bulk-delete',
                        ...lazyLoadRoute(() =>
                          import(
                            '@/pages/object-storage/s3/[region]/[s3Name]/objects/bulk-delete/BulkDeleteS3Objects.modal'
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
                '@/pages/object-storage/s3/[region]/[s3Name]/dashboard/S3Dashboard.page'
              ),
            ),
            children: [
              {
                path: 'delete',
                id: 's3.dashboard.delete',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/s3/[region]/[s3Name]/dashboard/delete/DeleteS3Storage.modal'
                  ),
                ),
              },
              {
                path: 'active-encryption',
                id: 'settings.encryption',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/s3/[region]/[s3Name]/dashboard/_components/activate-encryption/ActivateEncryption.modal'
                  ),
                ),
              },
              {
                path: 'active-versionning',
                id: 'settings.versionning',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/s3/[region]/[s3Name]/dashboard/_components/activate-versionning/ActivateVersionning.modal'
                  ),
                ),
              },
              {
                path: 'object-lock-options',
                id: 'settings.object-lock',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/s3/[region]/[s3Name]/dashboard/_components/object-lock-options/ObjectLockOptions.modal'
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
                '@/pages/object-storage/s3/[region]/[s3Name]/replication/Replication.page'
              ),
            ),
            children: [
              {
                id: 'replication.list',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/s3/[region]/[s3Name]/replication/ListReplicationRules.page'
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
                        '@/pages/object-storage/s3/[region]/[s3Name]/replication/delete/[ruleId]/DeleteReplicationRule.modal'
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
                    '@/pages/object-storage/s3/[region]/[s3Name]/replication/new/CreateReplicationRule.page'
                  ),
                ),
              },
              {
                path: 'edit/:ruleId',
                id: 'replication.edit',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/s3/[region]/[s3Name]/replication/edit/[ruleId]/UpdateReplicationRule.page'
                  ),
                ),
              },
              {
                path: 'storage-job',
                id: 'replication.storage-job',
                ...lazyLoadRoute(() =>
                  import(
                    '@/pages/object-storage/s3/[region]/[s3Name]/replication/storage-job/StorageJob.modal'
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
    path: '*',
    element: <NotFound />,
  },
];
