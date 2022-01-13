import controller from './controller';

export default {
  bindings: {
    clusters: '<',
    getClusterDetailsState: '<',
    nodeDetails: '<',
    serviceName: '<',
  },
  controller,
};
