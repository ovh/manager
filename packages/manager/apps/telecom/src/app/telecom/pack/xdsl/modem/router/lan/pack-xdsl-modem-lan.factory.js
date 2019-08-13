angular.module('managerApp').factory('PackXdslModemLanObject', (OvhApiXdsl, $translate, TucToast, $q) => {
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
  const PackXdslModemLanObject = function (data) {
    _.extend(
      this,
      template,
      _.pick(
        data,
        Object.keys(template),
      ),
    );
  };

  /**
     * Save a Lan
     * @param {String} serviceName Name of the pack xdslId
     * @return {Promise}
     */
  PackXdslModemLanObject.prototype.save = function (serviceName) {
    const self = this;
    this.busy = true;
    return OvhApiXdsl.Modem().Lan().v6().update(
      {
        xdslId: serviceName,
        lanName: this.lanName,
      },
      _.pick(this.tempValue, _.without(Object.keys(template), 'lanName')),
    ).$promise.then((data) => {
      _.extend(self, self.tempValue);
      self.toggleEdit(false);
      TucToast.success($translate.instant('xdsl_modem_lan_success', { name: self.IPAddress }));
      return data;
    }).catch((err) => {
      TucToast.error($translate.instant('xdsl_modem_lan_submit_error'));
      return $q.reject(err);
    }).finally(() => {
      self.busy = false;
    });
  };

  /**
     * Cancel edit mode
     */
  PackXdslModemLanObject.prototype.cancel = function () {
    this.toggleEdit(false);
    return this.id;
  };

  /**
     * Enter Edit Mode
     */
  PackXdslModemLanObject.prototype.edit = function () {
    this.tempValue = _.pick(this, Object.keys(template));
    this.toggleEdit(true);
  };

  /**
     * Toggle edit mode
     * @param {Boolean} state [Optional] if set, for the edit mode state
     * @return {Boolean} new edit mode state
     */
  PackXdslModemLanObject.prototype.toggleEdit = function (state) {
    if (_.isBoolean(state)) {
      this.editMode = state;
    } else {
      this.editMode = !this.editMode;
    }
    return this.editMode;
  };

  return PackXdslModemLanObject;
});
