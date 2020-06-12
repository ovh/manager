import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './novnc.component';
import './index.less';

const moduleName = 'ovhManagerVpsKvmNovncModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('dedicatedVpsKvmNovnc', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
