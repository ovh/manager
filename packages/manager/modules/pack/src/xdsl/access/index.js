import angular from 'angular';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import profilComponent from './profil/component';
import ipv6Component from './ipv6/component';

import poller from '../poller';

import controller from './controller';
import template from './template.html';

// console.log(ipv6Component);
const moduleName = 'ovhManagerPackXdslAccess';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    poller,
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack.xdsl.access', {
      url: '',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['.'],
    });
  })
  .component('packXdslAccessProfil', profilComponent)
  .component('packXdslAccessIpV6', ipv6Component);

export default moduleName;
