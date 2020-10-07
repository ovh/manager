import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import angular from 'angular';
import ovhManagerCloudConnect from '@ovh-ux/manager-cloud-connect';
import ovhManagerCore from '@ovh-ux/manager-core';

import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

const moduleName = 'cloudConnectApp';
angular
  .module(moduleName, [ovhManagerCore, ovhManagerCloudConnect])
  .run(
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }

      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
  )
  .run(
    /* @ngInject */ ($transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        unregisterHook();
      });
    },
  );

export default moduleName;
