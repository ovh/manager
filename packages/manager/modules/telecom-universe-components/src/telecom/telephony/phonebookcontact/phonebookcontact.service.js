import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import some from 'lodash/some';

export default /* @ngInject */ function (TUC_TELEPHONY_PHONEBOOK) {
  const self = this;

  self.getContactData = function getContactData(contact) {
    if (!contact) {
      return null;
    }
    return {
      group: isEmpty(contact.group)
        ? get(TUC_TELEPHONY_PHONEBOOK, 'emptyFields.group')
        : contact.group,
      name: contact.name,
      surname: contact.surname,
      homeMobile: isNull(contact.homeMobile) ? '' : contact.homeMobile,
      homePhone: isNull(contact.homePhone) ? '' : contact.homePhone,
      workMobile: isNull(contact.workMobile) ? '' : contact.workMobile,
      workPhone: isNull(contact.workPhone) ? '' : contact.workPhone,
    };
  };

  self.hasAtLeastOnePhoneNumber = function hasAtLeastOnePhoneNumber(contact) {
    if (!contact) {
      return null;
    }
    return some(
      TUC_TELEPHONY_PHONEBOOK.numberFields,
      (field) => !isEmpty(get(contact, field)),
    );
  };
}
