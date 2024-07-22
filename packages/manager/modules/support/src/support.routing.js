import component from './support.component';

export const state = {
  name: 'support',
  redirectTo: 'support.tickets',
  url: '/support',
  views: {
    '@': component.name,
  },
  resolve: {
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('ovhManagerSupport_header'),
  },
};

export default {
  state,
};
