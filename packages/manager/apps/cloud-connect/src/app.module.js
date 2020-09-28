import 'script-loader!jquery'; // eslint-disable-line
import '@ovh-ux/manager-cloud-connect';
import angular from 'angular';

angular.module('cloudConnectApp', ['ovhManagerCloudConnect']);
