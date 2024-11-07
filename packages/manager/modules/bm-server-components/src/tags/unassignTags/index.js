import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerBmServerComponentsUnassignTagsComponent';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('serverUnassignTags', component);

export default moduleName;
