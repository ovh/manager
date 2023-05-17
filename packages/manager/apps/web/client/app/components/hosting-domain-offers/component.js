import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    user: '<',
    catalog: '<',
    offers: '<',
    showDetails: '<',
    onOfferClick: '&',
  },
  controller,
  template,
};

export default component;
