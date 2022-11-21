import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import statusTemplate from './templates/status.html';
import prismUrl from './templates/prismUrl.html';
import serviceLink from './templates/serviceLink.html';
import localizationTemplate from './templates/localization.html';
import { CLUSTER_LIST_TITLE } from './constants';

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
      resources: /* @ngInject */ (clusters, NutanixService) => {
        return clusters.map((cluster) => {
          cluster.setLoadingDatacenter(true);
          NutanixService.getServer(cluster.getFirstNode())
            .then((data) => {
              cluster.setDatacenter(data.datacenter);
              cluster.setNodeDetails(data);
            })
            .finally(() => {
              cluster.setLoadingDatacenter(false);
            });
          return cluster;
        });
      },
      apiPath: () => '/nutanix',
      schema: /* @ngInject */ ($http) =>
        $http.get('/nutanix.json').then(({ data }) => data),
      dataModel: () => 'nutanix.cluster',
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_title'),
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
            property: 'targetSpec.nodes',
          },
          {
            title: CLUSTER_LIST_TITLE.TYPE_OF_PACK,
            property: 'serviceName',
            template:
              "<a data-ng-href='{{ $ctrl.getServiceNameLink($row) }}' target='_top' data-translate='nutanix_cluster_list_pack_type_details'></a",
          },
          {
            title: $translate.instant('nutanix_cluster_list_status'),
            template: statusTemplate,
          },
          {
            title: $translate.instant('nutanix_cluster_list_localisation'),
            property: 'datacenter',
            template: localizationTemplate,
          },
          {
            template: prismUrl,
            title: $translate.instant('nutanix_cluster_admin_interface'),
            property: 'targetSpec.controlPanelURL',
          },
        ];
      },
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('nutanix.dashboard', {
          serviceName,
        }),
      topbarOptions: /* @ngInject */ ($translate, $window) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('nutanix_order'),
          value: $translate.instant('nutanix_order'),
          onClick: () => {
            $window.open(
              'https://www.ovhcloud.com/fr/hosted-private-cloud/nutanix/',
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
    atInternet: {
      rename: 'hpc::nutanix::clusters',
    },
  });
};
