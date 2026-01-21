import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-api-services';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';
import { changelogButton } from '@ovh-ux/manager-components';

import routing from './sms.routing';
import component from './sms.component';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

const moduleName = 'ovhManagerSms';

angular
  .module(moduleName, [
    'ui.router',
    'ngAtInternet',
    'ngAtInternetUiRouterPlugin',
    'oc.lazyLoad',
    'ovh-api-services',
    'ovhManagerCore',
    changelogButton,
  ])
  .config(routing)
  .constant('CHANGELOG', {
    sms: {
      links: {
        changelog:
          'https://github.com/orgs/ovh/projects/18/views/2?pane=info&sliceBy%5Bvalue%5D=VoIP',
        roadmap:
          'https://github.com/orgs/ovh/projects/18/views/1?pane=info&sliceBy%5Bvalue%5D=VoIP',
        'feature-request':
          'https://github.com/ovh/collaborative-tools-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
      },
      chapters: ['telecom', 'sms', ''],
    },
  })
  .component('ovhManagerSms', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
