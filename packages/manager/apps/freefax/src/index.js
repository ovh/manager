import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerFreeFax from '@ovh-ux/manager-freefax';

import { registerApplication } from '@ovh-ux/manager-ufrontend';

registerApplication('sms', ({ api }) => {
  api.installAngularJSApplication({
    angular,
    modules: [ovhManagerFreeFax, ngOvhApiWrappers],
    template: '<div data-ui-view></div>',
  });
});
