import angular from 'angular';

import {
  atInternetClickDirective,
  trackOnDirective,
  trackImpressionDirective,
  trackImpressionClickDirective,
} from './directive';
import provider from './provider';

const moduleName = 'ngAtInternet';

angular
  .module(moduleName, [])
  .directive('atInternetClick', atInternetClickDirective)
  .directive('trackOn', trackOnDirective)
  .directive('trackImpression', trackImpressionDirective)
  .directive('trackImpressionClick', trackImpressionClickDirective)
  .provider('atInternet', provider);

export default moduleName;
