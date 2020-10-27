import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceFaxConvertToVoicefax from '../../../service/fax/convertToVoicefax';

import routing from './convert-to-voice-fax.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxFaxConvertToVoicefax';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceFaxConvertToVoicefax,
  ])
  .config(routing);

export default moduleName;
