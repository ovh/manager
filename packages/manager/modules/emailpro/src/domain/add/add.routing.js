import clone from 'lodash/clone';
import { ADD_STATES } from './add.constants';

const state = {
  url: '/add',
  template: `<div data-ng-init="setAction('emailpro/domain/add/emailpro-domain-add')"></div>`,
  resolve: {
    breadcrumb: () => null,
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(ADD_STATES.EMAIL_PRO, clone(state));
  $stateProvider.state(ADD_STATES.MXPLAN, clone(state));
};
