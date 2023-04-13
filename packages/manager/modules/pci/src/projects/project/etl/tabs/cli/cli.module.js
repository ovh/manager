import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import pciCodeSampleComponent from '../../../../../components/pci-code-sample';
import component from './cli.component';
import routing from './cli.routing';

const moduleName = 'ovhManagerPciEtlCli';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'oui',
    pciCodeSampleComponent,
  ])
  .config(routing)
  .component('pciProjectEtlCli', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
