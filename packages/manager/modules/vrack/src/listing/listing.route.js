import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import {
  VRACK_TRACKING_PREFIX,
  VRACK_TRACKING_CONTEXT,
  VRACK_DELETE_FEATURE,
  GUIDELINK,
  VRACK_SERVICE_TYPE,
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
      loadResource: /* @ngInject */ (vrackService) => (service) => {
        return vrackService
          .getVrackStatus(service.serviceName)
          .then((state) => {
            return {
              ...service,
              state,
            };
          });
      },
      defaultFilterColumn: () => 'serviceName',
      columnConfig: /* @ngInject */ ($translate) => ({
        data: [
          {
            label: $translate.instant(
              `vrack_listing_columns_header_serviceName`,
            ),
            serviceLink: true,
            property: 'serviceName',
            hidden: false,
          },
          {
            label: $translate.instant(
              `vrack_listing_columns_header_description`,
            ),
            property: 'description',
            hidden: false,
          },
          {
            label: $translate.instant(`vrack_listing_columns_header_name`),
            property: 'name',
            hidden: false,
          },
          {
            label: $translate.instant(`vrack_listing_columns_header_state`),
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
          }],
        }),
        header: /* @ngInject */ ($translate) =>
          $translate.instant('vrack_title'),
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
    })
    .state('vrack.index.not-empty', {
      url: '/not-empty/:serviceName',
      views: {
        modal: {
          component: 'vrackNotEmptyModal',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state) => () => {
          return $state.go('vrack.index');
        },
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        breadcrumb: () => null,
      },
      atInternet: {
        ignore: true,
      },
    })
    .state('vrack.index.terminateVrack', {
      url: '/terminate/:serviceName',
      views: {
        modal: {
          component: 'billingAutorenewTerminateAgoraService',
        },
      },
      layout: 'modal',
      redirectTo: (transition) => {
        const injector = transition.injector();
        const isEmptyPromise = injector.getAsync('isEmpty');
        const serviceNamePromise = injector.getAsync('serviceName');

        return Promise.all([
          isEmptyPromise,
          serviceNamePromise,
        ]).then(([isEmpty, serviceName]) =>
          !isEmpty
            ? { state: 'vrack.index.not-empty', params: { serviceName } }
            : false,
        );
      },
      resolve: {
        serviceType: () => VRACK_SERVICE_TYPE,
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        serviceInfos: /* @ngInject */ (serviceName, $http) =>
          $http
            .get(`/vrack/${serviceName}/serviceInfos`)
            .then(({ data }) => data),
        id: /* @ngInject */ (serviceInfos) => serviceInfos.serviceId,
        goBack: /* @ngInject */ ($state, Alerter) => (message, type) => {
          const promise = $state.go('vrack.index').then(() => {
            if (message) {
              Alerter.set(`alert-${type}`, message, null, 'InfoErrors');
            }
          });
          return promise;
        },
        isEmpty: /* @ngInject */ (OvhApiVrack, serviceName) =>
          OvhApiVrack.Aapi()
            .services({ serviceName })
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
