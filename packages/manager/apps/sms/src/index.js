/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!moment/min/moment.min';
/* eslint-enable import/no-webpack-loader-syntax */

import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerSms from '@ovh-ux/manager-sms';

import { getApplicationApi } from '@ovh-ux/manager-ufrontend';

getApplicationApi().then((api) => {
  api.installAngularJSApplication({
    angular,
    modules: [ovhManagerSms, ngOvhApiWrappers],
    template: '<div data-ui-view></div>',
  });

  api.messenger.on('navbar.ready', () => {
    console.log('application received navbar.ready');
  });

  api.messenger.emit('ready');
});
