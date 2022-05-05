import angular from 'angular';

import 'angular-translate';

import modalFormComponentModule from '../modal-form';
import component from './edit-name.component';
import { mismatchDirective } from './edit-name.directives';

const moduleName = 'ovhManagerNashaComponentsEditName';

angular
  .module(moduleName, ['pascalprecht.translate', modalFormComponentModule])
  .component('nashaComponentsEditName', component)
  .directive('mismatch', mismatchDirective)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
