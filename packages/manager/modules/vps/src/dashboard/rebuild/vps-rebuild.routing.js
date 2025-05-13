import sortBy from 'lodash/sortBy';

import component from './vps-rebuild.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.rebuild', {
    url: '/rebuild',
    views: {
      modal: {
        component: component.name,
      },
    },
    layout: 'modal',
    resolve: {
      availableImages: /* @ngInject */ (serviceName, vpsRebuild) =>
        vpsRebuild
          .getAvailableImages(serviceName)
          .then((availableImages) => sortBy(availableImages, 'name')),
      displayError: /* @ngInject */ ($translate, CucCloudMessage) => (
        errorMessage,
        errorDetail,
      ) =>
        CucCloudMessage.error(
          $translate.instant(errorMessage, { message: errorDetail }),
        ),
      displaySuccess: /* @ngInject */ (
        $transition$,
        $translate,
        CucCloudMessage,
        serviceName,
      ) => () =>
        CucCloudMessage.success(
          $translate.instant('vps_configuration_reinstall_success', {
            serviceName,
          }),
        ),
    },
  });
};
