import controller from './delete-topic.controller';
import template from './delete-topic.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDatabases: '<',
    topic: '<',
  },
  template,
  controller,
};

export default component;
