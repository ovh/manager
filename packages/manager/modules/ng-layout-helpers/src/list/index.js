import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-api-wrappers';

import ListLayoutCtrl from './list-layout.controller';
import component from './list-layout.component';
import utils from './list-layout.utils';

const moduleName = 'ovhManagerListLayout';

angular
  .module(moduleName, ['oui', 'ngOvhApiWrappers'])
  .component('managerListLayout', component);

export default {
  ...utils,
  ListLayoutCtrl,
  moduleName,
};
