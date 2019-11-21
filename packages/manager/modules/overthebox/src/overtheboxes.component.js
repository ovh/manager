import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';
import controller from './overtheboxes.controller';
import template from './overtheboxes.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,

    getOvertheboxLink: '<',
    viewOverthebox: '<',
  },
  controller,
  template,
};
