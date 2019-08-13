angular.module('managerApp').controller('XdslModemPortsCtrl', function ($stateParams, $translate, $scope, OvhApiXdslModemPort, TucToast, PackXdslModemPortObject, tucValidator, TucPackXdslModemMediator) {
  const self = this;
  self.loader = true;
  this.validator = tucValidator;
  this.mediator = TucPackXdslModemMediator;

  this.protocol = ['TCP', 'UDP'];

  /**
   * Cancel the edition/insertion of a port
   */
  this.cancel = function (port) {
    if (!port.cancel()) {
      _.remove(self.ports, port);
    }
  };

  /**
   * Check that this port name is uniqueName
   * @param                  {String} name Port name
   * @param {PackXdslModemPortObject} currentPort Current Port
   * @return {Boolean}
   */
  this.uniqueName = function (name, currentPort) {
    const found = _.find(this.ports, { name });
    if (!found) {
      return true;
    } if (!currentPort.id) {
      return false;
    }
    return currentPort.id === found.id;
  };

  /**
   * submit / unsubmit with keys
   * @param                   {Event} $event AngularJs Event
   * @param {PackXdslModemPortObject} port   Port to update
   * @param                 {Boolean} valid  Form valid ?
   */
  this.watchKey = function ($event, port, valid) {
    if ($event.keyCode === 13 && valid) {
      self.update(port);
    }
    if ($event.keyCode === 27) {
      self.cancel(port);
    }
  };

  /**
   * Update a port redirection
   * @param {PackXdslModemPortObject} port Port to update
   * @return {Promise}
   */
  this.update = function (port) {
    return port.save($stateParams.serviceName);
  };

  /**
   * Delete a port redirection
   * @param {PackXdslModemPortObject} port Port to update
   * @return {Promise}
   */
  this.delete = function (port) {
    _.set(port, 'busy', true);
    return port.remove($stateParams.serviceName).then((deletedPort) => {
      _.remove(self.ports, deletedPort);
    }).finally(() => {
      _.set(port, 'busy', false);
    });
  };

  /**
   * Add a port redirection
   */
  this.add = function () {
    const newPort = new PackXdslModemPortObject();
    self.ports.push(newPort);
    newPort.edit();
  };

  /**
   * Initialize controller
   */
  function init() {
    Object.defineProperty(self, 'hasEditing', {
      get() {
        return !!_.find(this.ports, { editMode: true });
      },
    });

    OvhApiXdslModemPort.Aapi().query({ xdslId: $stateParams.serviceName }).$promise.then((data) => {
      self.ports = _.map(data, port => new PackXdslModemPortObject(port));
    }).catch(() => {
      TucToast.error($translate.instant('xdsl_modem_ports_read_error'));
    }).finally(() => {
      self.loader = false;
    });
  }

  init();
});
