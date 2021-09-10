import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import orderComponent from './component';

const moduleName = 'ovhManagerAnthosDashboardComponentOrderHost';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('anthosOrderHost', orderComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
