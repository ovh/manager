import angular from 'angular';
import component from './component';

import './index.scss';

const moduleName = 'ovhManagerHubShortcutTile';

angular
  .module(moduleName, ['oui'])
  .component('ovhManagerHubShortcutTile', component);

export default moduleName;
