import angular from 'angular';
import translate from 'angular-translate';

import tooltipBox from '../tooltipBox/tooltipBox';

import alerterDirective from './alerter-directive';
import alerterService from './alerter-service';

const moduleName = 'ua.alerter';

angular
  .module(moduleName, [tooltipBox, translate])
  .service('Alerter', alerterService)
  .directive('ovhAlert', alerterDirective)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
