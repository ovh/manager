import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './proxy-form.component';

const moduleName = 'ovhManagerPciProjectKubeProxyForm';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('kubeProxyForm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
