import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';
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
