import angular from 'angular';
import 'angular-route';
import 'angular-ui-bootstrap';
import 'bootstrap';
import 'ckeditor';
import 'ng-ckeditor';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-web-universe-components';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import cacheTemplate from './emailpro.template';
import controllers from './emailproControllers.module';
import routing from './emailpro.routes';
import services from './emailproServices.module';
import upgrade from './upgrade';

import './css/exchangeDiagnostic.css';

import {
  EMAILPRO_MX_CONFIG,
  EMAILPRO_CONFIG_URL,
  EMAILPRO_CONFIG,
} from './emailpro.constants';

const moduleName = 'Module.emailpro';

angular
  .module(moduleName, [
    'ngOvhUtils',
    'ngRoute',
    'ui.bootstrap',
    'ngSanitize',
    'ngOvhWebUniverseComponents',
    'ng.ckeditor',
    controllers,
    services,
    upgrade,
  ])
  .constant('EMAILPRO_MX_CONFIG', EMAILPRO_MX_CONFIG)
  .constant('EMAILPRO_CONFIG_URL', EMAILPRO_CONFIG_URL)
  .constant('EMAILPRO_CONFIG', EMAILPRO_CONFIG)
  .config(routing)
  .provider(
    'EMAIL_CAPABILITIES',
    /* @ngInject */ (coreConfigProvider) => ({
      $get: () => ({
        isEmailProAvailable: coreConfigProvider.isRegion('EU'),
      }),
    }),
  )
  .run(cacheTemplate);

export default moduleName;
