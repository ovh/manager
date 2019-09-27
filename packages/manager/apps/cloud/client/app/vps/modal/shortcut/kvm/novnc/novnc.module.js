// import '@ovh-ux/ng-translate-async-loader';
// import 'angular-translate';
// import 'ovh-ui-angular';

import component from './novnc.component';
import './index.less';

const moduleName = 'ovhManagerVpsKvmNovnc';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('dedicatedVpsKvmNovnc', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
