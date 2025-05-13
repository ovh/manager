import get from 'lodash/get';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'ovhManagerOverTheBoxes',
    params: ListLayoutHelper.stateParams,
    resolve: {
      header: /* @ngInject */ ($translate) =>
        $translate.instant('overtheboxes_title'),
      apiPath: () => '/overTheBox',
      ...ListLayoutHelper.stateResolves,
      defaultFilterColumn: () => 'serviceName',
      dataModel: () => 'overTheBox.Service',
      overTheBoxStatusTypes: /* @ngInject */ (schema) =>
        get(schema.models, 'overTheBox.ServiceStatusEnum').enum,

      getOvertheboxLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('overTheBoxes.overTheBox.details', {
          serviceName,
        }),
      viewOverthebox: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.go('overTheBoxes.overTheBox.details', {
          serviceName,
        }),
      gotoOrder: /* @ngInject */ ($window, atInternet) => () => {
        atInternet.trackClick({
          name: 'overTheBoxes::index::order',
          type: 'action',
        });
        $window.open('https://www.ovhtelecom.fr/overthebox/', '_blank');
      },
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? 'overTheBoxes.onboarding' : false,
        ),
  });
};
