import component from './new-ticket.component';

export const state = {
  name: 'support.new',
  params: {
  },
  resolve: {
    goToTickets: /* @ngInject */ $state => () => $state.go('support.tickets'),
  },
  url: '/new',
  views: {
    'support@support': component.name,
  },
};

export default {
  state,
};
