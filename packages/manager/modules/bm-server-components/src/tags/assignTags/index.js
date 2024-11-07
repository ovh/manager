import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerBmServerComponentsAssignTagsComponent';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('serverAssignTags', component);

export default moduleName;
