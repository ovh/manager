import controller from './dedicatedCloud-mailing-list-subscribe.controller';
import template from './dedicatedCloud-mailing-list-subscribe.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    pccType: '<',
  },
  name: 'ovhManagerPccMailingListSubscribe',
};
