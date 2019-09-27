import component from './dedicatedCloud-datacenter-drp-ovh-confirmationStep.component';
import deleteController from '../../common/confirmation/delete/dedicatedCloud-datacenter-drp-confirmationStep-delete.controller';

const componentName = 'dedicatedCloudDatacenterDrpOvhConfirmationStep';
const deleteControllerName = 'DedicatedCloudDatacenterDrpConfirmationStepDeleteCtrl';
const moduleName = 'dedicatedCloudDatacenterDrpOvhConfirmationStep';

angular
  .module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh.confirmationStep', {
      views: {
        'stepView@app.dedicatedClouds.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOvhConfirmationStep',
        },
      },
      params: {
        currentStep: 3,
        drpInformations: { },
      },
    });
  })
  .component(componentName, component)
  .controller(deleteControllerName, deleteController)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
