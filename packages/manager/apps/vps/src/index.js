import 'script-loader!jquery'; // eslint-disable-line
import '@ovh-ux/manager-vps';

import angular from 'angular';

angular
  .module('vpsApp', [
    'ovhManagerVps',
  ]);
