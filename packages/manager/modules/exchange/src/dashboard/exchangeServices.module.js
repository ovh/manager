import angular from 'angular';

import exchangeAccount from '../account/account.service';
import exchangeAccountTypes from '../account/accountTypes.service';
import exchangeAccountOutlook from '../account/outlook/account-outlook.service';
import diagnostic from '../diagnostic/diagnostic.service';
import ExchangeDomains from '../domain/domain.service';
import ExchangeExternalContacts from '../external-contact/external-contact.service';
import group from '../group/group.service';
import exchangeHeader from '../header/header.service';
import exchangeHeaderLicence from '../header/license/service-license-history.service';
import officeAttach from '../office-attach/office-attach.service';
import ExchangeResources from '../resource/resource.service';
import formValidation from '../services/exchange.formValidation.service';
import messaging from '../services/exchange.messaging.service';
import exchangeSelectedService from '../services/exchange.selectedService.service';
import exchangeServiceInfrastructure from '../services/exchange.serviceInfrastucture.service';
import exchangeStates from '../services/exchange.state.service';
import exchangeVersion from '../services/exchange.version.service';
import ExchangeSharedAccounts from '../shared-account/shared-account.service';
import ExchangePublicFolders from '../shared/shared.service';
import wizardHostedCreationDomainConfiguration from '../wizard-hosted-creation/first-step/domain-configuration/domain-configuration.service';
import wizardHostedCreationEmailCreation from '../wizard-hosted-creation/first-step/email-creation/email-creation.service';

const moduleName = 'Module.exchange.services';

angular
  .module(moduleName, [])
  .service('exchangeAccount', exchangeAccount)
  .service('exchangeAccountTypes', exchangeAccountTypes)
  .service('exchangeAccountOutlook', exchangeAccountOutlook)
  .service('diagnostic', diagnostic)
  .service('ExchangeDomains', ExchangeDomains)
  .service('ExchangeExternalContacts', ExchangeExternalContacts)
  .service('group', group)
  .service('exchangeHeader', exchangeHeader)
  .service('exchangeHeaderLicence', exchangeHeaderLicence)
  .service('officeAttach', officeAttach)
  .service('ExchangeResources', ExchangeResources)
  .service('formValidation', formValidation)
  .service('messaging', messaging)
  .service('exchangeSelectedService', exchangeSelectedService)
  .service('exchangeServiceInfrastructure', exchangeServiceInfrastructure)
  .service('exchangeStates', exchangeStates)
  .service('exchangeVersion', exchangeVersion)
  .service('ExchangeSharedAccounts', ExchangeSharedAccounts)
  .service('ExchangePublicFolders', ExchangePublicFolders)
  .service(
    'wizardHostedCreationDomainConfiguration',
    wizardHostedCreationDomainConfiguration,
  )
  .service(
    'wizardHostedCreationEmailCreation',
    wizardHostedCreationEmailCreation,
  );

export default moduleName;
