import angular from 'angular';

import assignIn from 'lodash/assignIn';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import snakeCase from 'lodash/snakeCase';

export default /* @ngInject */ ($translate) => {
  const template = {
    email: '',
    type: 'simple',
    source: 'both',
  };

  /**
     * Object constructor
     * @param {Object} data Data from AAPI
     */
  const FreefaxNotificationObject = function FreefaxNotificationObject(data) {
    assignIn(
      this,
      template,
      pick(
        data,
        Object.keys(template),
      ),
    );
    this.inApi = data ? data.inApi : false;
  };

  /**
     * Cancel edit mode
     */
  FreefaxNotificationObject.prototype.cancel = function cancel() {
    this.toggleEdit(false);
    return this.inApi;
  };

  /**
     * Enter Edit Mode
     */
  FreefaxNotificationObject.prototype.edit = function edit() {
    this.tempValue = pick(this, Object.keys(template));
    this.toggleEdit(true);
  };

  /**
     * Toggle edit mode
     * @param {Boolean} state [Optional] if set, for the edit mode state
     * @return {Boolean} new edit mode state
     */
  FreefaxNotificationObject.prototype.toggleEdit = function toggleEdit(state) {
    if (isBoolean(state)) {
      this.editMode = state;
    } else {
      this.editMode = !this.editMode;
    }
    return this.editMode;
  };

  /**
     * Accept the editing values
     */
  FreefaxNotificationObject.prototype.accept = function accept() {
    assignIn(this, this.tempValue);
    this.toggleEdit(false);
  };

  /**
     * Identifier
     */
  Object.defineProperty(FreefaxNotificationObject.prototype, 'id', {
    get() {
      if (isEmpty(this.email)) {
        return null;
      }
      return snakeCase(this.email);
    },
    set: angular.noop,
  });

  /**
     * Identifier
     */
  Object.defineProperty(FreefaxNotificationObject.prototype, 'translatedType', {
    get() {
      if (this.type) {
        return $translate.instant(`freefax_notification_type_${this.type}`);
      }
      return '-';
    },
    set: angular.noop,
  });

  return FreefaxNotificationObject;
};
