import angular from 'angular';

import builder from './builder';

import 'ovh-ui-kit/dist/oui.css';
import './index.less';

const moduleName = 'ovhManagerNavbarMenuHeader';

angular.module(moduleName, [])
  .service('ovhManagerNavbarMenuHeaderBuilder', builder);

export default moduleName;
