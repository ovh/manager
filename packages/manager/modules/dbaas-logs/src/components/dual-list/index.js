import angular from 'angular';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './dual-list.less';

import component from './dual-list.component';
import filter from './dual-list.filter';
import provider from './dual-list.provider';

const moduleName = 'ovhManagerDbaasLogsComponentsDualList';

angular
  .module(moduleName, ['oui'])
  .filter('dbaasLogsDualListFilter', filter)
  .provider('dbaasLogsDualListProvider', provider)
  .component('dbaasLogsDualList', component);

export default moduleName;
