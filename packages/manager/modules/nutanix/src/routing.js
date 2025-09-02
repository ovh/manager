import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import statusTemplate from './templates/status.html';
import prismUrl from './templates/prismUrl.html';
import serviceLink from './templates/serviceLink.html';
import actionsMenu from './templates/actionsMenu.html';
import localizationTemplate from './templates/localization.html';
import { getNutanixOrderUrl } from './constants';

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
      resources: /* @ngInject */ (clusters, NutanixService, $q) => {
        const enrichedClustersPromises = clusters.map((cluster) => {
          cluster.setLoadingDatacenter(true);

          const serverPromise = NutanixService.getServer(
            cluster.getFirstNode(),
          ).then((data) => {
            cluster.setDatacenter(data.datacenter);
            cluster.setNodeDetails(data);
          });

          const billingPromise = NutanixService.getServiceInfo(
            cluster.serviceName,
          )
            .then((billingService) => {
              return NutanixService.getServicesDetails(billingService.id);
            })
            .then((servicesDetails) => {
              cluster.setStateBilling(servicesDetails?.resource?.state);
            });

          return $q
            .all([serverPromise, billingPromise])
            .then(() => {
              return cluster;
            })
            .finally(() => {
              cluster.setLoadingDatacenter(false);
            });
        });

        return $q.all(enrichedClustersPromises);
      },
      apiPath: () => '/nutanix',
      schema: /* @ngInject */ ($http) =>
        $http.get('/nutanix.json').then(({ data }) => data),
      dataModel: () => 'nutanix.cluster',
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_title'),
      changelog: () => 'nutanix',
      customizableColumns: () => true,
      columns: /* @ngInject */ ($translate) => {
        return [
          {
            title: $translate.instant('nutanix_cluster_list_name'),
            property: 'iam.displayName',
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
          {
            property: 'stateBilling',
            template: actionsMenu,
          },
        ].filter((column) => !!column);
      },
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('nutanix.dashboard', {
          serviceName,
        }),
      topbarOptions: /* @ngInject */ (
        $translate,
        $window,
        coreConfig,
        atInternet,
      ) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('nutanix_order'),
          value: $translate.instant('nutanix_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'hpc::nutanix::clusters::order',
              type: 'action',
            });
            $window.open(
              getNutanixOrderUrl(coreConfig.getUser().ovhSubsidiary),
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

  $stateProvider.state('nutanix.index.resiliate', {
    url: '/resiliate/:productId',

    layout: 'modal',
    views: {
      modal: {
        component: 'billingAutorenewTerminateAgoraService',
      },
    },

    resolve: {
      serviceType: () => 'NUTANIX',
      goBack: /* @ngInject */ ($state, Alerter, serviceName) => (
        message,
        type,
      ) => {
        const promise = $state.go('nutanix.index', {
          serviceName,
        });

        if (message) {
          promise.then(() =>
            Alerter.set(`alert-${type}`, message, null, 'manager-list-alert'),
          );
        }

        return promise;
      },
      serviceInfo: /* @ngInject */ (NutanixService, serviceName) =>
        NutanixService.getServiceInfo(serviceName),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      id: /* @ngInject */ (serviceInfo) => serviceInfo.serviceId,
    },
  });
};
