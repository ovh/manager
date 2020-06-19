/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!moment/min/moment.min';
/* eslint-enable import/no-webpack-loader-syntax */

import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerSms from '@ovh-ux/manager-sms';

import { registerApplication } from '@ovh-ux/manager-ufrontend';

registerApplication('sms', ({ api }) => {
  api.installAngularJSApplication({
    angular,
    modules: [ovhManagerSms, ngOvhApiWrappers],
    template: '<div data-ui-view></div>',
  });

  api.messenger.on('ready', ({ from }) => {
    if (from !== 'sms') {
      console.log('application received ready from', from);
    }
  });

  api.messenger.emit('ready');
});
