import angular from 'angular';

import exchangeHeader from '../header/header.component';
import exchangeWizardHostedCreationDomainConfiguration from '../wizard-hosted-creation/first-step/domain-configuration/domain-configuration.component';
import exchangeWizardHostedCreationEmailCreation from '../wizard-hosted-creation/first-step/email-creation/email-creation.component';
import exchangeWizardHostedCreationFirstStep from '../wizard-hosted-creation/first-step/first-step.component';
import exchangeWizardHostedCreationHeader from '../wizard-hosted-creation/first-step/header/header.component';
import exchangeWizardHostedCreationSummary from '../wizard-hosted-creation/summary/summary.component';
import exchangeWizardHostedCreation from '../wizard-hosted-creation/wizard-hosted-creation.component';

const moduleName = 'Module.exchange.components';

angular
  .module(moduleName, [])
  .component('exchangeHeader', exchangeHeader)
  .component(
    'exchangeWizardHostedCreationDomainConfiguration',
    exchangeWizardHostedCreationDomainConfiguration,
  )
  .component(
    'exchangeWizardHostedCreationEmailCreation',
    exchangeWizardHostedCreationEmailCreation,
  )
  .component(
    'exchangeWizardHostedCreationFirstStep',
    exchangeWizardHostedCreationFirstStep,
  )
  .component(
    'exchangeWizardHostedCreationHeader',
    exchangeWizardHostedCreationHeader,
  )
  .component(
    'exchangeWizardHostedCreationSummary',
    exchangeWizardHostedCreationSummary,
  )
  .component('exchangeWizardHostedCreation', exchangeWizardHostedCreation);

export default moduleName;
