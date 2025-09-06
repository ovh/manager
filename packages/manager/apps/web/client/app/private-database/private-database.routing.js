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
      columnConfig: /* @ngInject */ ($q) =>
        $q.resolve({
          data: [
            {
              property: 'serviceName',
              label: 'Service Name',
              serviceLink: true,
              hidden: false,
            },
            { property: 'displayName', label: 'Display Name', hidden: false },
            { property: 'hostname', label: 'Hostname', hidden: false },
            { property: 'port', label: 'Port', hidden: false },
            { property: 'versionLabel', label: 'Version Label', hidden: false },
            { property: 'version', label: 'Version', hidden: true },
            { property: 'type', label: 'Type', hidden: true },
            { property: 'state', label: 'State', hidden: true },
            { property: 'server', label: 'Server', hidden: true },
            { property: 'hostnameFtp', label: 'Hostname FTP', hidden: true },
            { property: 'portFtp', label: 'Port FTP', hidden: true },
            { property: 'guiUrl', label: 'GUI URL', hidden: true },
            { property: 'datacenter', label: 'Datacenter', hidden: true },
            { property: 'cpu', label: 'CPU', hidden: true },
          ],
        }),
    },
  });
};
