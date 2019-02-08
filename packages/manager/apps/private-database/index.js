import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import 'script-loader!moment/min/moment-with-locales'; // eslint-disable-line

import angular from 'angular';
import 'bootstrap';

import privateDatabase from '@ovh-ux/manager-private-database';

angular.module('privateDatabaseApp', [privateDatabase]);
