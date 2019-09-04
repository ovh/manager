import component from './support.component';

export const state = {
  name: 'support',
  redirectTo: 'support.tickets',
  url: '/support',
  views: {
    '@': component.name,
  },
};

export default {
  state,
};
