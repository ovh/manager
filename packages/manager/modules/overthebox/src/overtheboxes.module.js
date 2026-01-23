import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-api-services';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/manager-core';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import { changelogButton } from '@ovh-ux/manager-components';

import component from './overtheboxes.component';
import routing from './overtheboxes.routing';

const moduleName = 'ovhManagerOverTheBox';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    'ovh-api-services',
    ngAtInternet,
    ngOvhChart,
    changelogButton,
  ])
  .config(routing)
  .constant('CHANGELOG', {
    overTheBox: {
      links: {
        changelog:
          'https://github.com/orgs/ovh/projects/18/views/2?pane=info&sliceBy%5Bvalue%5D=Connectivity',
        roadmap:
          'https://github.com/orgs/ovh/projects/18/views/1?sliceBy%5Bvalue%5D=Connectivity&pane=info',
        'feature-request':
          'https://github.com/ovh/collaborative-tools-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
      },
      chapters: ['telecom', 'overTheBox', ''],
    },
  })
  .component('ovhManagerOverTheBoxes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
