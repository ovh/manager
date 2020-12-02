import assignIn from 'lodash/assignIn';
import isBoolean from 'lodash/isBoolean';
import pick from 'lodash/pick';
import without from 'lodash/without';

export default /* @ngInject */ (OvhApiXdsl, $translate, TucToast, $q) => {
  const template = {
    IPAddress: '',
    addressingType: '',
    subnetMask: '',
    lanName: '',
  };

  /**
   * Object constructor
   * @param {Object} data Data from APIv6
   */
  const PackXdslModemLanObject = function PackXdslModemLanObject(data) {
    assignIn(this, template, pick(data, Object.keys(template)));
  };

  /**
   * Save a Lan
   * @param {String} serviceName Name of the pack xdslId
   * @return {Promise}
   */
  PackXdslModemLanObject.prototype.save = function save(serviceName) {
    const self = this;
    this.busy = true;
    return OvhApiXdsl.Modem()
      .Lan()
      .v6()
      .update(
        {
          xdslId: serviceName,
          lanName: this.lanName,
        },
        pick(this.tempValue, without(Object.keys(template), 'lanName')),
      )
      .$promise.then((data) => {
        assignIn(self, self.tempValue);
        self.toggleEdit(false);
        TucToast.success(
          $translate.instant('xdsl_modem_lan_success', {
            name: self.IPAddress,
          }),
        );
        return data;
      })
      .catch((err) => {
        TucToast.error($translate.instant('xdsl_modem_lan_submit_error'));
        return $q.reject(err);
      })
      .finally(() => {
        self.busy = false;
      });
  };

  /**
   * Cancel edit mode
   */
  PackXdslModemLanObject.prototype.cancel = function cancel() {
    this.toggleEdit(false);
    return this.id;
  };

  /**
   * Enter Edit Mode
   */
  PackXdslModemLanObject.prototype.edit = function edit() {
    this.tempValue = pick(this, Object.keys(template));
    this.toggleEdit(true);
  };

  /**
   * Toggle edit mode
   * @param {Boolean} state [Optional] if set, for the edit mode state
   * @return {Boolean} new edit mode state
   */
  PackXdslModemLanObject.prototype.toggleEdit = function toggleEdit(state) {
    if (isBoolean(state)) {
      this.editMode = state;
    } else {
      this.editMode = !this.editMode;
    }
    return this.editMode;
  };

  return PackXdslModemLanObject;
};
