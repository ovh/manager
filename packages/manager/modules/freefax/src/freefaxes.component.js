import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';
import controller from './freefaxes.controller';
import template from './freefaxes.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,

    getFreefaxLink: '<',
    viewFreefax: '<',
  },
  controller,
  template,
};
