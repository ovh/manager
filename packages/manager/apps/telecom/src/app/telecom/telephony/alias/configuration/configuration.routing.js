import clone from 'lodash/clone';

import controller from './configuration.controller';
import template from './configuration.html';

import configurationFeatureRedirectTemplate from './feature/redirect/redirect.html';
import configurationFeatureRedirectController from './feature/redirect/redirect.controller';
import configurationFeatureContactCenterSolutionTemplate from './feature/contactCenterSolution/contact-center-solution.html';
import configurationFeatureContactCenterSolutionController from './feature/contactCenterSolution/contact-center-solution.controller';
import configurationFeatureConferenceTemplate from './feature/conference/conference.html';
import configurationFeatureConferenceController from './feature/conference/conference.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.configuration', {
    url: '/configuration',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
      'featureView@telecom.telephony.billingAccount.alias.configuration': {
        templateProvider: (alias) => {
          if (['ddi', 'redirect'].includes(alias.featureType)) {
            return configurationFeatureRedirectTemplate;
          }
          if (alias.featureType === 'contactCenterSolution') {
            return configurationFeatureContactCenterSolutionTemplate;
          }
          if (alias.featureType === 'conference') {
            return configurationFeatureConferenceTemplate;
          }
          return '';
        },
        controllerProvider: (alias) => {
          if (['ddi', 'redirect'].includes(alias.featureType)) {
            return configurationFeatureRedirectController;
          }
          if (alias.featureType === 'contactCenterSolution') {
            return configurationFeatureContactCenterSolutionController;
          }
          if (alias.featureType === 'conference') {
            return configurationFeatureConferenceController;
          }
          return null;
        },
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      alias: ($stateParams, tucVoipService) =>
        tucVoipService
          .fetchSingleService(
            $stateParams.billingAccount,
            $stateParams.serviceName,
          )
          .then((alias) => {
            const aliasCopy = clone(alias);
            aliasCopy.featureType = alias.isContactCenterSolution()
              ? 'contactCenterSolution'
              : alias.featureType;
            return aliasCopy;
          }),
      featureTypeLabel: ($translate) =>
        $translate
          .instant(
            'telephony_alias_configuration_configuration_type_contactCenterSolution',
          )
          .toLowerCase(),
    },
  });
};
