import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import statusTemplate from './templates/status.html';
import prismUrl from './templates/prismUrl.html';
import serviceLink from './templates/serviceLink.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((services) =>
          services.length === 0
            ? {
                state: 'nutanix.onboarding',
              }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      staticResources: () => true,
      resources: /* @ngInject */ (NutanixService) =>
        NutanixService.getClusters(),
      nodeDetails: /* @ngInject */ (resources, NutanixService) =>
        NutanixService.getServer(resources[0].getFirstNode()).then((data) => {
          resources[0].setNodeDetails(data);
        }),
      apiPath: () => '/nutanix',
      schema: /* @ngInject */ ($http) =>
        $http.get('/nutanix.json').then(({ data }) => data),
      dataModel: () => 'nutanix.cluster',
      defaultFilterColumn: () => 'serviceName',
      header: () => 'nutanix',
      customizableColumns: () => true,
      columns: /* @ngInject */ ($translate) => {
        return [
          {
            title: $translate.instant('nutanix_cluster_list_name'),
            property: 'serviceName',
            sortable: 'asc',
            searchable: true,
            filterable: true,
            template: serviceLink,
          },
          {
            title: $translate.instant('nutanix_cluster_list_number_of_nodes'),
            template: '{{::$row.getNumberOfNodes()}}',
          },
          {
            title: $translate.instant('nutanix_cluster_list_licence'),
            property: 'targetSpec.license',
            template:
              "<span class='text-capitalize' data-ng-bind='::$row.getLicense()'></span>",
          },
          {
            title: $translate.instant('nutanix_cluster_list_status'),
            template: statusTemplate,
          },
          {
            title: $translate.instant('nutanix_cluster_list_localisation'),
            template:
              "{{:: $row.nodeDetails.datacenter + ' (' + $row.nodeDetails.rack + ')'}}",
          },
          {
            template: prismUrl,
          },
        ];
      },
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('nutanix.dashboard', {
          serviceName,
        }),
      hideBreadcrumb: () => true,
    },
    atInternet: {
      rename: 'hpc::nutanix::clusters',
    },
  });
};
