import { Given } from '@cucumber/cucumber';
import { ICustomWorld } from '@playwright-helpers';
import { errors } from '../../mock/services/services';
import { ConfigParams } from '../../mock/handlers';
import {
  updateError,
  updateDisplayNameSuccess,
} from '../../src/public/translations/vrack-services/listing/Messages_fr_FR.json';
import { genericApiError } from '../../src/public/translations/vrack-services/Messages_fr_FR.json';
import {
  subnetCreationError,
  updateError as subnetEditError,
} from '../../src/public/translations/vrack-services/subnets/Messages_fr_FR.json';
import {
  endpointCreationError,
  updateError as endpointUpdateError,
} from '../../src/public/translations/vrack-services/endpoints/Messages_fr_FR.json';
import vrackServicesList from '../../mock/vrack-services/get-vrack-services.json';

Given('The vRack task service is {word}', function(
  this: ICustomWorld<ConfigParams>,
  okOrKo: 'ok' | 'ko',
) {
  this.handlersConfig.vrackTaskKo = okOrKo === 'ko';
  this.testContext.errorMessage = updateError;

  const vsIndex = vrackServicesList.findIndex((v) => v.currentState.vrackId);

  this.testContext.data.vsIndex = vsIndex;
  this.testContext.data.selectedVrackServices = vrackServicesList[vsIndex];
});

Given('The webservice to dissociate a vRack is {word}', function(
  this: ICustomWorld<ConfigParams>,
  okOrKo: 'ok' | 'ko',
) {
  this.handlersConfig.dissociateKo = okOrKo === 'ko';
  this.testContext.errorMessage = genericApiError;

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
    this.testContext.errorMessage = errors.update;
    this.testContext.message = updateDisplayNameSuccess;
  } else if (action === 'delete') {
    this.handlersConfig.deleteServicesKo = isKo;
    this.testContext.errorMessage = errors.delete;
  } else if (action === 'associate') {
    this.handlersConfig.associationKo = isKo;
    this.testContext.errorMessage = updateError;
  }
});

Given('The service to {word} a {word} is {word}', function(
  this: ICustomWorld<ConfigParams>,
  action: 'edit' | 'delete' | 'create',
  tab: 'subnet' | 'endpoint',
  okOrKo: 'OK' | 'KO',
) {
  const errorMessageByAction = {
    create: tab === 'subnet' ? subnetCreationError : endpointCreationError,
    edit: tab === 'subnet' ? subnetEditError : endpointUpdateError,
    delete: genericApiError,
  };

  this.handlersConfig.updateKo = okOrKo === 'KO';
  if (this.handlersConfig.updateKo) {
    this.testContext.errorMessage = errorMessageByAction[action];
  }
});
