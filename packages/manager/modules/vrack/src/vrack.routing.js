import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getVrackOrderUrl } from './vrack-order';

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
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: vrackId,
      }) =>
        $state.href('vrack.dashboard', {
          vrackId,
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
          label: $translate.instant('vrack_order'),
          value: $translate.instant('vrack_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'vrack::index::order',
              type: 'action',
            });
            $window.open(
              getVrackOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
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
