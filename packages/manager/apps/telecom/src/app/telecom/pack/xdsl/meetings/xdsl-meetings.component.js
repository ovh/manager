import controller from './xdsl-meetings.controller';
import template from './xdsl-meetings.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    meetings: '<',
    meetingSlots: '<',
  },
};
