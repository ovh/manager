import angular from 'angular';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!jquery-ui/ui/minified/core.min';
import 'script-loader!jquery-ui/ui/minified/widget.min';
import 'script-loader!jquery-ui/ui/minified/mouse.min';
import 'script-loader!jquery-ui/ui/minified/draggable.min';
import 'script-loader!messenger/build/js/messenger.js';
import 'script-loader!messenger/build/js/messenger-theme-future.js';
import 'script-loader!messenger/build/js/messenger-theme-flat.js';
import 'script-loader!jsplumb';
import 'script-loader!angular-ui-validate/dist/validate.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import '@ovh-ux/manager-pci';

angular.module('pciApp', ['ovhManagerPci']);
