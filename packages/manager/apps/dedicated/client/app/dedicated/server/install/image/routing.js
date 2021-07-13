import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard.install.image', {
    url: '/image',
    views: {
      '@app.dedicated-server': {
        component: 'dedicatedServerInstallImage',
      },
    },
    params: {
      installSource: null,
    },
    redirectTo: ($transition$) => {
      if ($transition$.params().installSource === null) {
        return {
          state: 'app.dedicated-server.server.install.choose-source',
        };
      }
      return null;
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_install_image_title'),

      dedicatedApiSchema: /* @ngInject */ (dedicatedServerInstall) =>
        dedicatedServerInstall.getDedicatedInstallTemplateApiSchema(),

      imageTypeEnum: /* @ngInject */ (dedicatedApiSchema) =>
        get(dedicatedApiSchema, 'models["dedicated.ImageTypesEnum"].enum'),

      checksumTypeEnum: /* @ngInject */ (dedicatedApiSchema) =>
        get(dedicatedApiSchema, 'models["dedicated.CheckSumTypesEnum"].enum'),

      goBack: /* @ngInject */ (goToServerDetails) => goToServerDetails,

      user: /* @ngInject */ (currentUser) => currentUser,

      installSource: /* @ngInject */ ($transition$) =>
        $transition$.params().installSource,
    },
    atInternet: {
      ignore: true,
    },
  });
};
