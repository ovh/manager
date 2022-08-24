import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './freefaxes.controller';
import template from './freefaxes.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,

    getFreefaxLink: '<',
    viewFreefax: '<',
    gotoOrder: '<',
  },
  controller,
  template,
};
