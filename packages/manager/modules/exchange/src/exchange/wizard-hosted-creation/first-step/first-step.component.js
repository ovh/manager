{
  class controller {
    displayComponent(componentName) {
      this.homepage.navigationState = componentName;
    }
  }

  angular.module('Module.exchange.components').component('exchangeWizardHostedCreationFirstStep', {
    templateUrl: 'exchange/wizard-hosted-creation/first-step/first-step.html',
    controller,
    require: {
      homepage: '^^exchangeWizardHostedCreation',
    },
  });
}
