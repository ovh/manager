import { Given } from '@cucumber/cucumber';
import { ICustomWorld } from '@playwright-helpers';
import { vsUpdateErrorMessage } from '../../mocks/vrack-services/vrack-services';
import { servicesMockErrors } from '../../../../../manager-react-components/src/hooks/services/mocks';
import { labels } from '../utils';
import { ConfigParams } from '../../mocks/handlers';
import vrackServicesList from '../../mocks/vrack-services/get-vrack-services.json';

Given('The vRack task service is {word}', function(
  this: ICustomWorld<ConfigParams>,
  okOrKo: 'ok' | 'ko',
) {
  this.handlersConfig.vrackTaskKo = okOrKo === 'ko';
  this.testContext.errorMessage = labels.modalVrackAssociationError;

  const vsIndex = vrackServicesList.findIndex((v) => v.currentState.vrackId);

  this.testContext.data.vsIndex = vsIndex;
  this.testContext.data.selectedVrackServices = vrackServicesList[vsIndex];
});

Given('The webservice to dissociate a vRack is {word}', function(
  this: ICustomWorld<ConfigParams>,
  okOrKo: 'ok' | 'ko',
) {
  this.handlersConfig.dissociateKo = okOrKo === 'ko';
  this.testContext.errorMessage = labels.modalDissociateError;
  this.testContext.message = labels.vrackServicesDissociateSuccess;

  const vsIndex = vrackServicesList.findIndex((v) => v.currentState.vrackId);

  this.testContext.data.vsIndex = vsIndex;
  this.testContext.data.selectedVrackServices = vrackServicesList[vsIndex];
});

Given('The service to {word} a vRack Services is {word}', function(
  this: ICustomWorld<ConfigParams>,
  action: 'edit' | 'delete' | 'associate',
  okOrKo: 'OK' | 'KO',
) {
  const isKo = okOrKo === 'KO';
  if (action === 'edit') {
    this.handlersConfig.updateServicesKo = isKo;
    this.testContext.errorMessage = servicesMockErrors.update;
    this.testContext.message = labels.updateVrackServicesDisplayNameSuccess;
  } else if (action === 'delete') {
    this.handlersConfig.deleteServicesKo = isKo;
    this.testContext.errorMessage = servicesMockErrors.delete;
    this.testContext.message = labels.terminateVrackServicesSuccess;
  } else if (action === 'associate') {
    this.handlersConfig.associationKo = isKo;
    this.testContext.errorMessage = labels.modalVrackAssociationError;
    this.testContext.message = labels.vrackServicesAssociateSuccess;
  }
});

Given('The service to {word} a {word} is {word}', function(
  this: ICustomWorld<ConfigParams>,
  action: 'edit' | 'delete' | 'create',
  tab: 'subnet' | 'endpoint',
  okOrKo: 'OK' | 'KO',
) {
  const errorMessageByAction = {
    create:
      tab === 'subnet'
        ? labels.subnetCreationError
        : labels.endpointCreationError,
    edit: tab === 'subnet' ? vsUpdateErrorMessage : servicesMockErrors.update,
    delete: vsUpdateErrorMessage,
  };

  const successMessageByAction = {
    create:
      tab === 'subnet'
        ? labels.subnetCreationSuccess
        : labels.endpointCreationSuccess,
    edit:
      tab === 'subnet'
        ? labels.subnetUpdateSuccess
        : labels.endpointUpdateDisplayNameSuccess,
    delete:
      tab === 'subnet'
        ? labels.subnetDeleteSuccess
        : labels.endpointDeleteSuccess,
  };

  this.handlersConfig.updateKo = okOrKo === 'KO';
  if (this.handlersConfig.updateKo) {
    this.testContext.errorMessage = errorMessageByAction[action];
  } else {
    this.testContext.message = successMessageByAction[action];
  }
});

Given('Feature availability service is {word}', function(
  this: ICustomWorld<ConfigParams>,
  okOrKo: 'ok' | 'ko',
) {
  this.handlersConfig.isFeatureAvailabilityServiceKo = okOrKo === 'ko';
});

Given('vRack Services feature is {word}', function(
  this: ICustomWorld<ConfigParams>,
  availability: 'available' | 'unavailable',
) {
  this.handlersConfig.isVrackServicesFeatureUnavailable =
    availability === 'unavailable';
});
