import controller from './informations.controller';
import template from './informations.html';
import './informations.scss';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    user: '<',
  },
  controller,
  template,
};

export default component;
