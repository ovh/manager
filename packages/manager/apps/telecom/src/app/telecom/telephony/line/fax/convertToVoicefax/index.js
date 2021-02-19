import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import serviceFaxConvertToVoicefax from '../../../service/fax/convertToVoicefax';

import routing from './convert-to-voicefax.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineFaxConvertToVoicefax';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
    serviceFaxConvertToVoicefax,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
