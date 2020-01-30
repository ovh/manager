import isEmpty from 'lodash/isEmpty';

/* eslint-disable class-methods-use-this */
export default class FormValidation {
  /**
   *
   * @param {Object} form The form which contains the field to test
   * @param {String} fieldName The name of the field
   * @param {String} validationType The validation to search for (required, max, pattern, etc)
   */
  doesFieldContainsErrors(form, fieldName, validationType) {
    if (form == null || isEmpty(fieldName) || isEmpty(validationType)) {
      // eslint-disable-next-line no-throw-literal
      throw `ArgumentError: doesFieldContainsErrors(form = ${form}, fieldName = ${fieldName}, validationType = ${validationType})`;
    }

    const fieldExists = form[fieldName] != null;

    if (!fieldExists) {
      // eslint-disable-next-line no-throw-literal
      throw `The ${fieldName} doesn't exist in the form ${form}`;
    }

    const isDirty = form[fieldName].$dirty;
    const hasValidationValue = form[fieldName].$error[validationType] != null;
    const isValid =
      hasValidationValue && form[fieldName].$error[validationType];
    const thereIsAnError = isDirty && isValid;

    return thereIsAnError;
  }
}
/* eslint-enable class-methods-use-this */
