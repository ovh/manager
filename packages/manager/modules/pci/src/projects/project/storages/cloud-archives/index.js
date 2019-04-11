import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import 'ovh-ui-angular';
import 'ovh-api-services';
import 'angular-ui-bootstrap';

import containers from '../containers';

import addObject from './add';
import cloudArchive from './cloud-archive';

import routing from './cloud-archives.routing';

const moduleName = 'ovhManagerPciStoragesCloudArchives';

angular
  .module(moduleName, [
    addObject,
    containers,
    cloudArchive,
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
