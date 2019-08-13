angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.email.general-informations', {
    url: 'domain/informations',
    templateUrl:
      'email-domain/general-informations/email-domain-general-informations.html',
    controller: 'EmailTabGeneralInformationsCtrl',
  });
});
