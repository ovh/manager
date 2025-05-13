import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import {
  VRACK_TRACKING_PREFIX,
  VRACK_TRACKING_CONTEXT,
  VRACK_DELETE_FEATURE,
  GUIDELINK,
} from '../vrack.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'vrackListing',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: /* @ngInject */ () => '/vrack',
      dataModel: () => 'vrack.vrack',
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/vracks', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),

      loadResource: /* @ngInject */ (vrackService) => (service) => {
        return vrackService.getVrackStatus(service.id).then((state) => {
          return {
            ...service,
            serviceName: service.id,
            state,
          };
        });
      },
      defaultFilterColumn: () => 'serviceName',
      columnConfig: /* @ngInject */ () => ({
        data: [
          {
            label: 'Service Name',
            serviceLink: true,
            property: 'serviceName',
            hidden: false,
          },
          { label: 'Description', property: 'description', hidden: false },
          { label: 'Name', property: 'name', hidden: false },
          {
            label: 'Status',
            property: 'state',
            sortable: false,
            filterable: false,
            hidden: false,
            format: (value) => value.state,
            map: (row) => {
              switch (row.state) {
                case 'active':
                  return 'success';
                case 'deleted':
                  return 'warning';
                case 'suspended':
                  return 'error';
                default:
                  return 'info';
              }
            },
          },
        ],
      }),
      header: /* @ngInject */ ($translate) => $translate.instant('vrack_title'),
      changelog: () => 'vrack',
      guideLinks: /* @ngInject */ (coreConfig) =>
        GUIDELINK[coreConfig.getUser().ovhSubsidiary] || GUIDELINK.DEFAULT,
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: vrackId,
      }) =>
        $state.href('vrack.dashboard', {
          vrackId,
        }),
      hideBreadcrumb: () => true,
      isDeleteOptionsAvailable: /* @ngInject */ (ovhFeatureFlipping) => {
        return ovhFeatureFlipping
          .checkFeatureAvailability([VRACK_DELETE_FEATURE])
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(VRACK_DELETE_FEATURE),
          )
          .catch(() => false);
      },
    },
    atInternet: {
      rename: `${VRACK_TRACKING_PREFIX}vrack-private-network::listing::manage_vrack-private-network`,
      ...VRACK_TRACKING_CONTEXT,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length === 0 ? { state: 'vrack.onboarding' } : false,
        ),
  });
  $stateProvider.state('vrack.index.terminateVrack', {
    url: '/terminate-vrack?service&serviceType',
    views: {
      modal: {
        component: 'billingTerminateVrack',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        if (message) {
          Alerter.set(`alert-${type}`, message, null, 'InfoErrors');
        }
        return $state.go('vrack.index');
      },
      service: /* @ngInject */ ($transition$) => $transition$.params().service,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      isEmpty: /* @ngInject */ (OvhApiVrack, service) =>
        OvhApiVrack.Aapi()
          .services({ serviceName: service })
          .$promise.then((allServicesParam) => {
            const services = Object.entries(allServicesParam).filter(
              ([, value]) => {
                return Array.isArray(value) && value.length;
              },
            );
            return !services.length;
          })
          .catch(() => {
            return false;
          }),
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
