import 'script-loader!jquery'; // eslint-disable-line
import angular from 'angular';
import '@ovh-ux/manager-cloud-connect';
import ovhManagerCore from '@ovh-ux/manager-core';

angular.module('cloudConnectApp', ['ovhManagerCloudConnect', ovhManagerCore]);
