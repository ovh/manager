import angular from 'angular';
import 'angular-animate';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ng-ui-router-layout';
import 'oclazyload';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-proxy-request';
import '@ovh-ux/ng-ovh-user-pref';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import '@ovh-ux/ng-q-allsettled';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-pagination-front';
import 'angular-ui-bootstrap';

import '@ovh-ux/manager-cloud-styles';
import 'ovh-manager-webfont/dist/css/ovh-font.css';
import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import 'font-awesome/css/font-awesome.css';
import 'ovh-common-style/dist/ovh-common-style.css';

import components from './components';
import error from './error';
import projects from './projects';
import template from './template.html';

import sidebar from './projects/project/sidebar';

import './index.scss';

import {
  CLOUD_INSTANCE_DEFAULTS,
  CLOUD_INSTANCE_DEFAULT_FALLBACK,
  CLOUD_FLAVOR_SPECIFIC_IMAGE,
  CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES,
  CLOUD_VOLUME_TYPES,
  CLOUD_IPFO_ORDER_LIMIT,
  CLOUD_GEOLOCALISATION,
  CLOUD_VM_STATE,
  CLOUD_UNIT_CONVERSION,
  CLOUD_MONITORING,
  CLOUD_PROJECT_OVERVIEW_THRESHOLD,
  CLOUD_PROJECT_STATE,
  CLOUD_PCA_FILE_STATE,
  PCI_REDIRECT_URLS,
  PCI_URLS,
  TRACKING_CLOUD,
} from './constants';

const moduleName = 'ovhManagerPci';

angular
  .module(moduleName, [
    components,
    error,
    projects,
    sidebar,
    'ui.router',
    'ngOvhCloudUniverseComponents',
    'ngOvhProxyRequest',
    'ngOvhUserPref',
    'ngOvhSwimmingPoll',
    'ngUiRouterBreadcrumb',
    'ngUiRouterLayout',
    'ngAtInternet',
    'ngPaginationFront',
    'ngQAllSettled',
    'ovh-api-services',
    'oui',
    'ui.bootstrap',
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci', {
        url: '/pci',
        abstract: true,
        template,
        resolve: {
          me: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
        },
      });
    },
  )
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'pci.**' }, () => $translate.refresh());
    },
  )
  .constant('CLOUD_INSTANCE_DEFAULTS', CLOUD_INSTANCE_DEFAULTS)
  .constant('CLOUD_INSTANCE_DEFAULT_FALLBACK', CLOUD_INSTANCE_DEFAULT_FALLBACK)
  .constant('CLOUD_FLAVOR_SPECIFIC_IMAGE', CLOUD_FLAVOR_SPECIFIC_IMAGE)
  .constant(
    'CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES',
    CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES,
  )
  .constant('CLOUD_VOLUME_TYPES', CLOUD_VOLUME_TYPES)
  .constant('CLOUD_IPFO_ORDER_LIMIT', CLOUD_IPFO_ORDER_LIMIT)
  .constant('CLOUD_GEOLOCALISATION', CLOUD_GEOLOCALISATION)
  .constant('CLOUD_VM_STATE', CLOUD_VM_STATE)
  .constant('CLOUD_UNIT_CONVERSION', CLOUD_UNIT_CONVERSION)
  .constant('CLOUD_MONITORING', CLOUD_MONITORING)
  .constant(
    'CLOUD_PROJECT_OVERVIEW_THRESHOLD',
    CLOUD_PROJECT_OVERVIEW_THRESHOLD,
  )
  .constant('CLOUD_PROJECT_STATE', CLOUD_PROJECT_STATE)
  .constant('CLOUD_PCA_FILE_STATE', CLOUD_PCA_FILE_STATE)
  .constant('PCI_REDIRECT_URLS', PCI_REDIRECT_URLS)
  .constant('PCI_URLS', PCI_URLS)
  .constant('TRACKING_CLOUD', TRACKING_CLOUD);

export default moduleName;
