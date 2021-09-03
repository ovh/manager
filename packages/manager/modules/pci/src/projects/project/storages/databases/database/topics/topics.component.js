import controller from './topics.controller';
import template from './topics.html';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    trackDashboard: '<',
    addTopic: '<',
    deleteTopic: '<',
    topicsList: '<',
  },
  controller,
  template,
};
