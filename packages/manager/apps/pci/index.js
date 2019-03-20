import angular from 'angular';

import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import 'script-loader!jquery-ui/ui/minified/core.min'; // eslint-disable-line
import 'script-loader!jquery-ui/ui/minified/widget.min'; // eslint-disable-line
import 'script-loader!jquery-ui/ui/minified/mouse.min'; // eslint-disable-line
import 'script-loader!jquery-ui/ui/minified/draggable.min'; // eslint-disable-line
import 'script-loader!messenger/build/js/messenger.js'; // eslint-disable-line
import 'script-loader!messenger/build/js/messenger-theme-future.js'; // eslint-disable-line
import 'script-loader!messenger/build/js/messenger-theme-flat.js'; // eslint-disable-line
import 'script-loader!messenger/build/js/messenger-theme-flat.js'; // eslint-disable-line
import 'script-loader!jsplumb'; // eslint-disable-line
import 'script-loader!angular-ui-validate/dist/validate.js'; // eslint-disable-line

import '@ovh-ux/manager-pci';

angular.module('pciApp', ['ovhManagerPci']);
