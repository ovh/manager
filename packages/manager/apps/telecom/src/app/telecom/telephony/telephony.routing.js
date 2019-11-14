import template from './telecom-telephony.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony', {
    url: '/telephony',
    abstract: true,
    views: {
      'telecomView@telecom': {
        template,
      },
    },
  });
};
