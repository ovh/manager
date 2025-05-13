import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './overtheboxes.controller';
import template from './overtheboxes.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,
    overTheBoxStatusTypes: '<',

    getOvertheboxLink: '<',
    viewOverthebox: '<',
    gotoOrder: '<',
  },
  controller,
  template,
};
