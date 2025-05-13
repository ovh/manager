import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import serviceChoicePopoverComponent from '../../../../../../../../components/telecom/telephony/service/choice-popover';

import routing from './sounds.routing';

const moduleName =
  'ovhManagerTelecomTelephonyAliasConfigurationFeatureContactCenterSolutionSounds';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceChoicePopoverComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations ../../translations */);

export default moduleName;
