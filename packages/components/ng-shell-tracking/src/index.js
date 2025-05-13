import angular from 'angular';

import {
  atInternetClickDirective,
  trackOnDirective,
  trackImpressionDirective,
  trackImpressionClickDirective,
} from './directive';
import NgAtInternet from './provider';

const moduleName = 'ngAtInternet';

export const registerAtInternet = (trackingPlugin) => {
  angular
    .module(moduleName, [])
    .directive('atInternetClick', atInternetClickDirective)
    .directive('trackOn', trackOnDirective)
    .directive('trackImpression', trackImpressionDirective)
    .directive('trackImpressionClick', trackImpressionClickDirective)
    .provider('atInternet', new NgAtInternet(trackingPlugin));

  return moduleName;
};

export default moduleName;
