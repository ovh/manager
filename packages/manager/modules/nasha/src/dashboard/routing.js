import template from './template.html';
import nashaAddTemplate from '../add/nasha-add.html';
import nashaUnavailableTemplate from '../add/nasha-unavailable.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('nasha.dashboard', {
      url: '/:nashaId',
      redirectTo: 'nasha.dashboard.nasha-partitions',
      template,
      controller: 'NashaCtrl',
      controllerAs: 'NashaCtrl',
      translations: {
        value: ['../common', '.'],
        format: 'json',
      },
    })
    .state('nasha.nasha-add', {
      url: '/new',
      template: nashaAddTemplate,
      controller: 'NashaAddCtrl',
      controllerAs: 'NashaAddCtrl',
      translations: {
        value: ['add', '.', '..'],
        format: 'json',
      },
    })
    .state('nasha.nasha-unavailable', {
      url: '/unavailable',
      template: nashaUnavailableTemplate,
      controller: 'NashaUnavailableCtrl',
      controllerAs: '$ctrl',
      translations: {
        value: ['add', '.', '..'],
        format: 'json',
      },
    });
};
