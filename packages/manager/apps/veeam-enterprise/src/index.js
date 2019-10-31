import 'script-loader!jquery'; // eslint-disable-line
import '@ovh-ux/manager-veeam-enterprise';

import angular from 'angular';

angular
  .module('veeam-enterpriseApp', [
    'ovhManagerVeeamEnterprise',
  ]);
