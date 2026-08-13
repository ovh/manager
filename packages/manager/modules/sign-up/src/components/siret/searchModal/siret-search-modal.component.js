import template from './siret-search-modal.html';
import controller from './siret-search-modal.controller';

export default {
  template,
  controller,
  bindings: {
    country: '<',
    // drives the wording (company / association / administration)
    legalForm: '<?',
    trackingMode: '<?',
    // called with the company the customer confirmed: { suggestion }
    onValidate: '&',
    // dismissing the modal must leave the caller untouched
    onCancel: '&',
  },
};
