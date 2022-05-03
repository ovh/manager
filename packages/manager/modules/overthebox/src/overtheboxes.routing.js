import get from 'lodash/get';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'ovhManagerOverTheBoxes',
    params: ListLayoutHelper.stateParams,
    resolve: {
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
