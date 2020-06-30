import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line

import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerOtb from '@ovh-ux/manager-overthebox';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit/dist/oui-olt.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.min.css';
import 'ovh-ui-kit-bs/dist/oui-bs3-olt.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';

angular.module('overtheboxApp', [ngOvhApiWrappers, ovhManagerOtb]);
