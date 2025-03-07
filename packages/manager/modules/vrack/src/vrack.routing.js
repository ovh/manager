import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import {
  VRACK_TRACKING_PREFIX,
  VRACK_TRACKING_CONTEXT,
} from './vrack.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
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
      staticResources: () => true,
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
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: vrackId,
      }) =>
        $state.href('vrack.dashboard', {
          vrackId,
        }),
      topbarOptions: /* @ngInject */ ($translate, $state, atInternet) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('vrack_order'),
          value: $translate.instant('vrack_order'),
          onClick: () => {
            atInternet.trackClick({
              name: `${VRACK_TRACKING_PREFIX}page::button::go-to-order::vrack-private-network`,
              ...VRACK_TRACKING_CONTEXT,
              type: 'action',
            });
            $state.go('vrack.order');
          },
        },
      }),
      hideBreadcrumb: () => true,
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
};
