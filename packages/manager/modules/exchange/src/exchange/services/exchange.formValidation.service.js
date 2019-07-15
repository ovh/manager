/* eslint-disable class-methods-use-this */
angular.module('Module.exchange.services').service(
  'formValidation',
  class FormValidation {
    /**
     *
     * @param {Object} form The form which contains the field to test
     * @param {String} fieldName The name of the field
     * @param {String} validationType The validation to search for (required, max, pattern, etc)
     */
    doesFieldContainsErrors(form, fieldName, validationType) {
      if (form == null || _.isEmpty(fieldName) || _.isEmpty(validationType)) {
        throw `ArgumentError: doesFieldContainsErrors(form = ${form}, fieldName = ${fieldName}, validationType = ${validationType})`; // eslint-disable-line
      }

      const fieldExists = form[fieldName] != null;

      if (!fieldExists) {
        throw `The ${fieldName} doesn't exist in the form ${form}`; // eslint-disable-line
      }

      const isDirty = form[fieldName].$dirty;
      const hasValidationValue = form[fieldName].$error[validationType] != null;
      const isValid = hasValidationValue && form[fieldName].$error[validationType];
      const thereIsAnError = isDirty && isValid;

      return thereIsAnError;
    }
  },
);
/* eslint-enable class-methods-use-this */
