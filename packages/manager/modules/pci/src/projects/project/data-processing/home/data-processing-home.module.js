import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-swimming-poll';

import routing from './data-processing-home.routing';
import dataProcessingComponentHome from './data-processing-home.component';

const moduleName = 'ovhManagerPciProjectDataProcessingHome';

angular
  .module(moduleName, ['pascalprecht.translate', 'ngOvhSwimmingPoll'])
  .config(routing)
  .component('pciProjectDataProcessingHome', dataProcessingComponentHome)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
