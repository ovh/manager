import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import set from 'lodash/set';
import component from './submit.component';
import routing from './submit.routing';
import ovhManagerPciStoragesContainers from '../../../storages/containers';

const moduleName = 'ovhManagerPciTrainingJobsSubmit';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerPciStoragesContainers,
  ])
  .config(routing)
  .component('pciProjectTrainingJobsSubmitComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .directive('validMount', () => ({
    require: 'ngModel',
    restrict: 'A',
    link(scope, elm, attrs, ngModel) {
      set(ngModel, '$validators.validMount', (value) => {
        const volumes = scope.$eval(attrs.validMount);
        // checks that the mount path is unique
        return !volumes.map(({ mountPath }) => mountPath).includes(value);
      });
    },
  }));

export default moduleName;
