import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    user: '<',
    catalog: '<',
    offers: '<',
    currentOffer: '<',
    customerRegion: '<',
    showDetails: '<',
    onGroupOfferClick: '&',
  },
  controller,
  template,
};

export default component;
