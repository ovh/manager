import get from 'lodash/get';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes', {
    url: '/overTheBox',
    abstract: true,
  });

  $stateProvider.state('overTheBoxes.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'ovhManagerOverTheBoxes',
    params: ListLayoutHelper.stateParams,
    resolve: {
      apiPath: () => '/overTheBox',
      ...ListLayoutHelper.stateResolves,
      schema: /* @ngInject */ (OvhApiOverTheBox) =>
        OvhApiOverTheBox.v6().schema().$promise,
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
    },
  });
};
