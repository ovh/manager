import angular from 'angular';
import component from './order-tracking.component';

import './index.scss';

const moduleName = 'orderTracking';
const componentName = 'orderTrackingComponent';

angular
  .module(moduleName, [])
  .component(componentName, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
