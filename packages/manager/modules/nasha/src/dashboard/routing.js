import template from './template.html';
import nashaOrderCompleteTemplate from '../order/template.html';
import nashaAddTemplate from '../add/nasha-add.html';
import nashaUnavailableTemplate from '../add/nasha-unavailable.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('nasha', {
      abstract: true,
      url: '/paas/nasha/:nashaId',
      template,
      controller: 'NashaCtrl',
      controllerAs: 'NashaCtrl',
      translations: {
        value: ['../common', '.'],
        format: 'json',
      },
    })
    .state('nasha-order-complete', {
      url: '/nasha/order/complete',
      template: nashaOrderCompleteTemplate,
      controller: 'NashaOrderCompleteCtrl',
      controllerAs: 'NashaOrderCompleteCtrl',
      translations: {
        value: ['order', '.', '..'],
        format: 'json',
      },
      params: {
        orderUrl: null,
      },
    })
    .state('nasha-add', {
      url: '/nasha/new',
      template: nashaAddTemplate,
      controller: 'NashaAddCtrl',
      controllerAs: 'NashaAddCtrl',
      translations: {
        value: ['add', '.', '..'],
        format: 'json',
      },
    })
    .state('nasha-unavailable', {
      url: '/nasha/unavailable',
      template: nashaUnavailableTemplate,
      controller: 'NashaUnavailableCtrl',
      controllerAs: '$ctrl',
      translations: {
        value: ['add', '.', '..'],
        format: 'json',
      },
    });
};
