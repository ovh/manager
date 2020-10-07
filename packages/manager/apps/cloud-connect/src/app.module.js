import 'script-loader!jquery'; // eslint-disable-line
import angular from 'angular';
import ovhManagerCloudConnect from '@ovh-ux/manager-cloud-connect';
import ovhManagerCore from '@ovh-ux/manager-core';

import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

const moduleName = 'cloudConnectApp';

angular.module(moduleName, [ovhManagerCloudConnect, ovhManagerCore]).run(
  /* @ngInject */ ($transitions) => {
    const unregisterHook = $transitions.onSuccess({}, () => {
      detachPreloader();
      unregisterHook();
    });
  },
);

export default moduleName;
