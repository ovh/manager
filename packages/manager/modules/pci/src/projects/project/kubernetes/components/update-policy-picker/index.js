import angular from 'angular';
import angularTranslate from 'angular-translate';
import uiKit from '@ovh-ux/ui-kit';

import component from './update-policy-picker.component';

const moduleName = 'ovhManagerPciKubeUpdatePolicyPicker';

angular
  .module(moduleName, [angularTranslate, uiKit])
  .component('pciProjectKubeUpdatePolicyPicker', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
