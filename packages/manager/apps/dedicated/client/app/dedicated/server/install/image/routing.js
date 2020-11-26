import get from 'lodash/get';

import component from './component';
import configComponent from './components/config/component';
import configDriveComponent from './components/config-drive/component';
import optionsComponent from './components/options/component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.install.image', {
    url: '/image',
    views: {
      '@app.dedicated': {
        component: component.name,
      },

      'config@app.dedicated.server.install.image': configComponent.name,

      'options@app.dedicated.server.install.image': optionsComponent.name,

      'configDrive@app.dedicated.server.install.image':
        configDriveComponent.name,
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
  });
};
