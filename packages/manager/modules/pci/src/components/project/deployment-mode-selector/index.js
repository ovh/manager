import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/manager-filters';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import component from './deployment-mode.component';
import service from './deployment-mode.service';

const moduleName = 'ovhManagerDeploymentModeSelector';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhFeatureFlipping',
  ])
  .component('pciProjectDeploymentModeSelector', component)
  .service('PciProjectDeploymentMode', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
