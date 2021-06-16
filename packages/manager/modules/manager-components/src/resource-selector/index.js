import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './component';
import './index.scss';

const moduleName = 'ovhManagerComponentsResourceSelector';

angular
  .module(moduleName, ['oui'])
  .component('managerResourceSelector', component);

export default moduleName;
