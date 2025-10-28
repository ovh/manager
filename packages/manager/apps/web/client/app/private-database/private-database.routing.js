import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('noFilterPrivateDatabase')
        .then((noFilterPrivateDatabase) =>
          noFilterPrivateDatabase.data.length === 0
            ? { state: 'app.private-database.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/hosting/privateDatabase',
      dataModel: () => 'hosting.privateDatabase.Service',
      noFilterPrivateDatabase: /* @ngInject */ ($http) =>
        $http.get('/hosting/privateDatabase'),
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('private_databases_title'),
      changelog: () => 'web_cloud_databases',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: productId,
      }) =>
        $state.href('app.private-database.dashboard', {
          productId,
        }),
      topbarOptions: /* @ngInject */ ($translate, $state, atInternet) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('private_databases_order'),
          value: $translate.instant('private_databases_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'web::private-database::index::order',
              type: 'action',
            });
            $state.go('app.private-database-order-clouddb');
          },
        },
      }),
      hideBreadcrumb: () => true,
      columnConfig: /* @ngInject */ ($q, $translate) =>
        $q.resolve({
          data: [
            {
              property: 'serviceName',
              label: $translate.instant(
                'private_database_columns_header_servicename',
              ),
              serviceLink: true,
              hidden: false,
            },
            {
              property: 'displayName',
              label: $translate.instant(
                'private_database_columns_header_displayname',
              ),
              hidden: false,
            },
            {
              property: 'hostname',
              label: $translate.instant(
                'private_database_columns_header_hostname',
              ),
              hidden: false,
            },
            {
              property: 'port',
              label: $translate.instant('private_database_columns_header_port'),
              hidden: false,
            },
            {
              property: 'versionLabel',
              label: $translate.instant(
                'private_database_columns_header_version',
              ),
              hidden: false,
            },
            {
              property: 'type',
              label: $translate.instant('private_database_columns_header_type'),
              hidden: true,
            },
            {
              property: 'state',
              label: $translate.instant(
                'private_database_columns_header_state',
              ),
              hidden: true,
            },
            {
              property: 'server',
              label: $translate.instant(
                'private_database_columns_header_server',
              ),
              hidden: true,
            },
            {
              property: 'hostnameFtp',
              label: $translate.instant(
                'private_database_columns_header_hostname_ftp',
              ),
              hidden: true,
            },
            {
              property: 'portFtp',
              label: $translate.instant(
                'private_database_columns_header_port_ftp',
              ),
              hidden: true,
            },
            {
              property: 'guiUrl',
              label: $translate.instant(
                'private_database_columns_header_guiurl',
              ),
              hidden: true,
            },
            {
              property: 'datacenter',
              label: $translate.instant(
                'private_database_columns_header_datacenter',
              ),
              hidden: true,
            },
            {
              property: 'cpu',
              label: $translate.instant('private_database_columns_header_cpu'),
              hidden: true,
            },
          ],
        }),
    },
  });
};
