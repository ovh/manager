import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'angular-ui-bootstrap';
import '@ovh-ux/ng-ovh-sidebar-menu';

import ovhManagerCore from '@ovh-ux/manager-core';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngOvhDocUrl from '@ovh-ux/ng-ovh-doc-url';

import { Environment } from '@ovh-ux/manager-config';

import cdaDetails from '../details';
import cdaDetailsHome from '../details/home';
import cdaIp from '../ip';
import cdaPool from '../pool';
import cdaUser from '../user';
import routing from './routing';
import service from './cda.service';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './cda.less';

const moduleName = 'ovhManagerCdaDashboard';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    'oui',
    'ui.bootstrap',
    'ngOvhSidebarMenu',
    ovhManagerCore,
    ngAtInternet,
    ngOvhDocUrl,
    ngOvhCloudUniverseComponents,
    cdaDetails,
    cdaDetailsHome,
    cdaIp,
    cdaUser,
    cdaPool,
  ])
  .config(routing)
  .config(
    /* @ngInject */ ($qProvider, ovhDocUrlProvider) => {
      ovhDocUrlProvider.setUserLocale(Environment.getUserLocale());
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .service('CdaService', service)
  .run(($transitions, CdaService) => {
    $transitions.onSuccess({ to: 'cda.dashboard.**' }, (transition) => {
      CdaService.initDetails(transition.params().serviceName);
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
