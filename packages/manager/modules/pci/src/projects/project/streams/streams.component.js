import controller from './streams.controller';
import template from './streams.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    streams: '<',
    getStreamDetails: '<',
    addStreamLink: '<',
    streamLink: '<',
    viewStream: '<',
    deleteStream: '<',
  },
};
