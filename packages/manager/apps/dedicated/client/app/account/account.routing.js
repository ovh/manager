export default /* @ngInject */($stateProvider) => {
  [
    {
      abstract: true,
      name: 'app.account',
    },
    {
      abstract: true,
      name: 'app.account.service',
      template: '<ui-view/>',
    },
    /**
     * @deprecated starting 2019-11-01
     */
    {
      name: 'app.account.otrs-ticket',
      redirectTo: 'support',
      url: '/ticket',
    },
    /**
     * @deprecated starting 2019-11-01
     */
    {
      name: 'app.account.otrs-ticket-details',
      redirectTo: 'support.tickets.ticket',
      url: '/ticket/:ticketId',
    },
  ]
    .forEach(state => $stateProvider.state(state.name, state));
};
