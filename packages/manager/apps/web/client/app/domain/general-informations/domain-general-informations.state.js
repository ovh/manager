import template from './GENERAL_INFORMATIONS.html';

const state = {
  url: '/information',
  views: {
    domainView: {
      template,
      controller: 'DomainTabGeneralInformationsCtrl',
    },
  },
  atInternet: {
    rename: 'GENERAL_INFORMATIONS',
  },
};

export default state;
