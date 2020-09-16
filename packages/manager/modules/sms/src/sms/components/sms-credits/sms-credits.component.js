import template from './sms-credits.html';

export default {
  bindings: {
    credits: '<',
    orderHref: '<',
  },
  name: 'ovhManagerSmsSmsCredits',
  template,
};
