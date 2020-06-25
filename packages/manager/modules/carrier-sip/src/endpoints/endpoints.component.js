import template from './endpoints.html';

export default {
  bindings: {
    endpointIpList: '<',
    endpointsWithIncomingCallsAllowed: '<',
  },
  name: 'carrierSipEndpoints',
  template,
};
