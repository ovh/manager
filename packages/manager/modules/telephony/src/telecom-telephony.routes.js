import template from './telecom-telephony.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony', {
    abstract: true,
    url: '/telephony',
    template,
    translations: ['.'],
  });
};
