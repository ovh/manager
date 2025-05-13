import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import template from './choice-popover.html';
import directive from './choice-popover.directive';

import './choice-popover.less';

import choiceModule from '../choice';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyServiceChoicePopover';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    choiceModule,
  ])
  .directive('voipServiceChoicePopover', directive)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'components/telecom/telephony/service/choice-popover/choice-popover.html',
        template,
      );
    },
  );

export default moduleName;
