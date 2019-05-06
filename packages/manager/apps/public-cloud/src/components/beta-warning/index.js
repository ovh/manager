import angular from 'angular';
import 'ovh-ui-angular';

import component from './beta-warning.component';

import './beta-warning.less';

const moduleName = 'ovh-manager-betaWarning';

angular
  .module(moduleName, [
    'oui',
  ])
  .component('publicCloudBetaWarning', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
