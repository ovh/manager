import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import directive from './uploader.directive';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupNumberFeatureOvhPabxSoundUploader';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .directive('telephonyNumberOvhPabxSoundUploader', directive);

export default moduleName;
