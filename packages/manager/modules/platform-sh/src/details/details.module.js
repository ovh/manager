import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './component';
import routing from './details.routing';
import service from './service';

const moduleName = 'ovhManagerPlatformShDetailComponent';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ui.router',
    service,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'platformShDetailComponent',
    component,
  );

export default moduleName;
