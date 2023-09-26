import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    serviceName: '<',
    sizeFlavour: '<',
    catalogGateway: '<',
    regionsPlansGroupBySize: '<',
    privateNetworkCreationLink: '<',
    creationPageLink: '<',
    goToListingPage: '<',
  },
  controller,
  template,
};
