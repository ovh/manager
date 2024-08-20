import angular from 'angular';
import 'angular-translate';

import component from './network-form.component';

const moduleName = 'ovhManagerPciProjectKubeNetworkForm';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('kubeNetworkForm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
