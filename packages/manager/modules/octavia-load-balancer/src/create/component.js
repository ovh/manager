import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    serviceName: '<',
    sizeFlavour: '<',
    catalogGateway: '<',
    catalogFloatingIp: '<',
    regionsPlansGroupBySize: '<',
    privateNetworkCreationLink: '<',
    creationPageLink: '<',
    goToListingPage: '<',
  },
  controller,
  template,
};
