import controller from './resources.controller';
import template from './resources.html';

import './resources.less';

export default {
  bindings: {
    resources: '<',
  },
  controller,
  name: 'supportNewIssuesFormResources',
  template,
};
