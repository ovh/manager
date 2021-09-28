import angular from 'angular';

import { CHARTJS } from './chartjs.constants';
import pciChartjsDirective from './chartjs.directive';
import pciChartjsFactory from './chartjs.factory';

const moduleName = 'pciChartjs';

angular
  .module(moduleName, [])
  .constant('PCI_CHARTS', CHARTJS)
  .directive('pciChartjs', pciChartjsDirective)
  .factory('PciChartjsFactory', pciChartjsFactory);

export default moduleName;
