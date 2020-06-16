/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!moment/min/moment.min';
/* eslint-enable import/no-webpack-loader-syntax */

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit/dist/oui-olt.css';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerSms from '@ovh-ux/manager-sms';

import { boot } from '@ovh-ux/ovh-ufrontend';

boot().then((api) => {
  api.installAngularJSApplication(
    [ovhManagerSms, ngOvhApiWrappers],
    '<div data-ui-view></div>',
  );
  api.setApplicationTitle('OVHcloud - SMS');
});
