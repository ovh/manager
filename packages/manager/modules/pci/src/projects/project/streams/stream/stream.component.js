import controller from './stream.controller';
import template from './stream.html';

export default {
  controller,
  template,
  bindings: {
    stream: '<',
    gotToStreams: '<',
    streamLink: '<',
    subscriptionsLink: '<',
    currentActiveLink: '<',
    editBacklogRetention: '<',
    editReplayRetention: '<',
    editThrottling: '<',
    viewSubscriptions: '<',
    regenerateToken: '<',
    deleteStream: '<',
  },
};
