import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard.install.image', {
    url: '/image',
    views: {
      '@app.dedicated-server': {
        component: 'serverInstallImage',
      },

      'config@app.dedicated-server.server.dashboard.install.image':
        'serverInstallImageConfig',

      'options@app.dedicated-server.server.dashboard.install.image':
        'serverInstallImageOptions',

      'configDrive@app.dedicated-server.server.dashboard.install.image':
        'serverInstallImageConfigDrive',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_install_image_title'),

      loaders: () => ({
        launchInstall: false,
      }),

      model: () => ({
        httpHeader: [],
        configdrive: {
          metadata: [],
        },
      }),

      dedicatedApiSchema: /* @ngInject */ (dedicatedServerInstall) =>
        dedicatedServerInstall.getDedicatedInstallTemplateApiSchema(),

      imageTypeEnum: /* @ngInject */ (dedicatedApiSchema) =>
        get(dedicatedApiSchema, 'models["dedicated.ImageTypesEnum"].enum'),

      checksumTypeEnum: /* @ngInject */ (dedicatedApiSchema) =>
        get(dedicatedApiSchema, 'models["dedicated.CheckSumTypesEnum"].enum'),
    },
    atInternet: {
      ignore: true,
    },
  });
};
