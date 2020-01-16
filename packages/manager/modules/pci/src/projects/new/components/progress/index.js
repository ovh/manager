import angular from 'angular';

import component from './component';

import './index.scss';

const moduleName = 'pciProjectNewProgress';

angular
  .module(moduleName, [])
  .component(component.name, component);

export default moduleName;
