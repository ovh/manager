import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import privateDatabase from '@ovh-ux/manager-private-database';

import angular from 'angular';

angular.module('privateDatabaseApp', [privateDatabase]);
