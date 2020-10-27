import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './packs.controller';
import template from './packs.html';

export default {
  controller,
  template,
  bindings: {
    ...ListLayoutHelper.componentBindings,
    loadResource: '<',

    getPackLink: '<',
    viewPack: '<',
  },
};
