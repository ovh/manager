import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import 'script-loader!messenger/build/js/messenger.js'; // eslint-disable-line
import 'script-loader!messenger/build/js/messenger-theme-future.js'; // eslint-disable-line
import 'script-loader!messenger/build/js/messenger-theme-flat.js'; // eslint-disable-line

import angular from 'angular';
import '@ovh-ux/manager-pci';

angular.module('pciApp', ['ovhManagerPci']);
