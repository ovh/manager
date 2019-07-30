import _ from 'lodash';

import component from './ticket.component';
import { state as ticketState } from '../tickets/tickets.routing';

import { STATE_NAME } from '../support.constants';

export const state = {
  name: `${STATE_NAME}.ticket`,
  params: {
    id: {
      type: 'int',
    },
  },
  resolve: {
    goBack: /* @ngInject */ $state => () => $state
      .go(ticketState.name),
    reload: /* @ngInject */ $state => () => $state
      .reload(),
    ticket: /* @ngInject */ ($transition$, ticketMessageService, ticketService) => ticketService
      .get($transition$.params().id)
      .then(ticketFromApi => ticketService.buildFromApi(ticketFromApi))
      .then(ticket => ticketMessageService
        .query($transition$.params().id)
        .then(messagesFromAPi => _.set(
          ticket,
          'messages',
          _.map(
            messagesFromAPi,
            messageFromApi => ticketMessageService.buildFromApi(messageFromApi),
          ),
        ))),
  },
  translations: { format: 'json', value: ['.'] },
  url: '/ticket/:id',
  views: {
    support: component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
