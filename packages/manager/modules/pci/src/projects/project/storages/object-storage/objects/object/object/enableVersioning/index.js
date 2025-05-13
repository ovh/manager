import angular from 'angular';

import containers from '../../../../../containers';
import routing from './enable.routing';

const moduleName =
  'ovhManagerPciStoragesObjectStorageObjectsObjectEnableVersioning';

angular
  .module(moduleName, [
    containers,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
