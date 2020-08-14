import angular from 'angular';

import contentComponent from './content/component';

import './index.less';

const moduleName = 'cuiPage';

angular
  .module(moduleName, [])
  .component('cuiPageContentTitle', contentComponent);

export default moduleName;
