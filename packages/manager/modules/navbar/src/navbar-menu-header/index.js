import angular from 'angular';

import builder from './builder';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import './index.less';

const moduleName = 'ovhManagerNavbarMenuHeader';

angular.module(moduleName, [])
  .service('ovhManagerNavbarMenuHeaderBuilder', builder);

export default moduleName;
