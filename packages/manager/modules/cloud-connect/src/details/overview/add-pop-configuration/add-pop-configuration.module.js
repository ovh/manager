import angular from 'angular';

import component from './add-pop-configuration.component';
import routing from './add-pop-configuration.routing';

const moduleName = 'ovhCloudConnectDetailsAddPopConfiguration';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsAddPopConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore(
        { to: 'cloud-connect.details.overview.add-pop' },
        () => $translate.refresh(),
      );
    },
  );

export default moduleName;
