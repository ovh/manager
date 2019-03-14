import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-proxy-request';
import '@ovh-ux/ng-ovh-user-pref';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ng-ovh-doc-url';
import 'ng-at-internet';
import 'ovh-angular-toaster';
import 'ovh-api-services';
import 'ovh-ui-angular';
import 'ovh-angular-otrs';
import 'ovh-jquery-ui-draggable-ng';
import 'ovh-angular-q-allsettled';
import 'ovh-angular-pagination-front';

import '@ovh-ux/manager-cloud-styles';
import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import components from './components';
import offer from './offer';
import project from './project';

import {
  CLOUD_INSTANCE_DEFAULTS,
  CLOUD_INSTANCE_DEFAULT_FALLBACK,
  CLOUD_FLAVORTYPE_CATEGORY,
  CLOUD_FLAVOR_SPECIFIC_IMAGE,
  CLOUD_INSTANCE_CPU_FREQUENCY,
  CLOUD_INSTANCE_NUMBER_OF_GPUS,
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
} from './constants';

// TODO : import './index.less';

const moduleName = 'ovhManagerPci';

angular
  .module(moduleName, [
    components,
    project,
    offer,
    'ui.router',
    'ngOvhCloudUniverseComponents',
    'ngOvhProxyRequest',
    'ngOvhUserPref',
    'ngOvhSwimmingPoll',
    'ngOvhDocUrl',
    'ng-at-internet',
    'ovh-api-services',
    'ovh-angular-toaster',
    'ovh-angular-otrs',
    'ovh-jquery-ui-draggable-ng',
    'ovh-angular-q-allSettled',
    'ovh-angular-pagination-front',
    'oui',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas', {
        url: '/iaas',
        abstract: true,
        template: '<ui-view class="cloud-legacy"/>',
        translations: {
          format: 'json',
          value: ['../common', '.'],
        },
      })
      .state('paas', {
        url: '/paas',
        abstract: true,
        template: '<ui-view class="cloud-legacy"/>',
        translations: {
          value: ['../common', '.'],
          format: 'json',
        },
      });
  })
  .run(($transitions, $state, $stateParams) => {
    $transitions.onSuccess({}, (transition) => {
      const state = transition.to();
      if (state && state.url === '/compute') {
        if ($state.includes('iaas.pci-project')) {
          if ($stateParams.createNewVm) {
            $state.go('iaas.pci-project.compute.infrastructure', {
              createNewVm: true,
            });
          } else {
            $state.go('iaas.pci-project.compute.infrastructure');
          }
        }
      } else if (state && state.url === '/billing') {
        $state.go('iaas.pci-project.billing.consumption');
      }
    });
  })
  .constant('CLOUD_INSTANCE_DEFAULTS', CLOUD_INSTANCE_DEFAULTS)
  .constant('CLOUD_INSTANCE_DEFAULT_FALLBACK', CLOUD_INSTANCE_DEFAULT_FALLBACK)
  .constant('CLOUD_FLAVORTYPE_CATEGORY', CLOUD_FLAVORTYPE_CATEGORY)
  .constant('CLOUD_FLAVOR_SPECIFIC_IMAGE', CLOUD_FLAVOR_SPECIFIC_IMAGE)
  .constant('CLOUD_INSTANCE_CPU_FREQUENCY', CLOUD_INSTANCE_CPU_FREQUENCY)
  .constant('CLOUD_INSTANCE_NUMBER_OF_GPUS', CLOUD_INSTANCE_NUMBER_OF_GPUS)
  .constant('CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES', CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES)
  .constant('CLOUD_VOLUME_TYPES', CLOUD_VOLUME_TYPES)
  .constant('CLOUD_IPFO_ORDER_LIMIT', CLOUD_IPFO_ORDER_LIMIT)
  .constant('CLOUD_GEOLOCALISATION', CLOUD_GEOLOCALISATION)
  .constant('CLOUD_VM_STATE', CLOUD_VM_STATE)
  .constant('CLOUD_UNIT_CONVERSION', CLOUD_UNIT_CONVERSION)
  .constant('CLOUD_MONITORING', CLOUD_MONITORING)
  .constant('CLOUD_PROJECT_OVERVIEW_THRESHOLD', CLOUD_PROJECT_OVERVIEW_THRESHOLD)
  .constant('CLOUD_PROJECT_STATE', CLOUD_PROJECT_STATE)
  .constant('CLOUD_PCA_FILE_STATE', CLOUD_PCA_FILE_STATE)
  .constant('PCI_REDIRECT_URLS', PCI_REDIRECT_URLS)
  .constant('PCI_URLS', PCI_URLS);

export default moduleName;
