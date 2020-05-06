/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!moment/min/moment.min';
/* eslint-enable import/no-webpack-loader-syntax */

import Postmate from 'postmate';

import angular from 'angular';
import ovhManagerSms from '@ovh-ux/manager-sms';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';

angular.module('smsApp', [ngOvhApiWrappers, ovhManagerSms]);

const handshake = new Postmate.Model({
  updateHash: (hash) => {
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  },
});

handshake.then((parent) => {
  window.addEventListener('hashchange', () => {
    parent.emit('hashChange', window.location.hash);
  });
  // init hash
  parent.emit('hashChange', window.location.hash);
});
