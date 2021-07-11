import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';

import './label.less';

import label from './label.component';

const moduleName = 'ovhManagerTrustedNicLabel';

angular
  .module(moduleName, ['oui', 'ovhManagerCore', 'pascalprecht.translate'])
  .component('ovhManagerTrustedNicLabel', label)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
