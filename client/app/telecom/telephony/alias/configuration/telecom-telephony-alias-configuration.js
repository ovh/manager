angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration', {
    url: '/configuration',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/telecom-telephony-alias-configuration.html',
        controller: 'TelecomTelephonyAliasConfigurationCtrl',
        controllerAs: '$ctrl',
      },
      'featureView@telecom.telephony.alias.configuration': {
        templateProvider: (alias) => {
          const featureType = alias.featureType === 'ddi' ? 'redirect' : alias.featureType;
          return `<div data-ng-include="::'app/telecom/telephony/alias/configuration/feature/${featureType}/telecom-telephony-alias-configuration-${featureType}.html'"></div>`;
        },
        controllerProvider: (alias) => {
          const isNotEmptyFeature = alias.featureType !== 'empty';
          const featureType = alias.featureType === 'ddi' ? 'redirect' : alias.featureType;
          return isNotEmptyFeature ? `TelecomTelephonyAliasConfiguration${_.capitalize(featureType)}Ctrl` : null;
        },
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      alias: ($stateParams, tucVoipService) => tucVoipService
        .fetchSingleService($stateParams.billingAccount, $stateParams.serviceName)
        .then((alias) => {
          const aliasCopy = _.clone(alias);
          aliasCopy.featureType = alias.isContactCenterSolution() ? 'contactCenterSolution' : alias.featureType;
          return aliasCopy;
        }),
      featureTypeLabel: $translate => $translate.instant('telephony_alias_configuration_configuration_type_contactCenterSolution').toLowerCase(),
    },
    translations: { value: ['.', '..'], format: 'json' },
  });
});
