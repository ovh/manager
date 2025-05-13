import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './upgrade-server.component';

const moduleName = 'ovhManagerBmServerComponentsDashboardUpgrade';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('serverUpgrade', component)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
