import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import timeConditionComponent from '../../../../../../../timeCondition';

import template from './edit.html';
import controller from './edit.controller';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupNumberFeatureOvhPabxDiaplplanExtensionEdit';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    timeConditionComponent,
  ])
  .controller('telephonyNumberOvhPabxDialplanExtensionEditCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'components/telecom/telephony/group/number/feature/ovhPabx/dialplan/extension/edit/edit.html',
        template,
      );
    },
  );

export default moduleName;
