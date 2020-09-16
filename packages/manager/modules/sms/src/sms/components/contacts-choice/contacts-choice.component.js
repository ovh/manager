import controller from './contacts-choice.controller';
import template from './contacts-choice.html';

export default {
  bindings: {
    cancelSelection: '<',
    getPhonebookContacts: '<',
    goBack: '<',
    model: '=',
    phonebooks: '<',
  },
  controller,
  name: 'ovhManagerSmsContactsChoice',
  template,
};
