import angular from 'angular';

import directive from './telecom-telephony-service-choice-popover.directive';
import popoverTemplate from './telecom-telephony-service-choice-popover.html';

import './telecom-telephony-service-popover.less';

const moduleName = 'ovhManagerTelephonyServiceChoicePopover';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .run(($templateCache) => {
    $templateCache.put('telecom/telephony/components/service/telecom-telephony-service-choice-popover.html', popoverTemplate);
  })
  .directive('voipServiceChoicePopover', directive);

export default moduleName;
