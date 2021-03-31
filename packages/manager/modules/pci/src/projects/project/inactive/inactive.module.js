import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import routing from './inactive.routing';
import component from './inactive.component';

const moduleName = 'ovhManagerPciProjectsProjectInactive';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectInactive', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
