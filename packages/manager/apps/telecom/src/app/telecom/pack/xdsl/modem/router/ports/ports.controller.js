import find from 'lodash/find';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';

import { PACK_XDSL } from './ports.constants';

export default /* @ngInject */ function XdslModemPortsCtrl(
  $stateParams,
  $translate,
  OvhApiXdslModemPort,
  TucToast,
  PackXdslModemPortObject,
  tucValidator,
  TucPackXdslModemMediator,
) {
  const self = this;
  self.loader = true;
  this.validator = tucValidator;
  this.mediator = TucPackXdslModemMediator;
  this.PACK_XDSL = PACK_XDSL;

  this.protocol = ['TCP', 'UDP'];

  /**
   * Cancel the edition/insertion of a port
   */
  this.cancel = function cancel(port) {
    if (!port.cancel()) {
      remove(self.ports, port);
    }
  };

  /**
   * Check that this port name is uniqueName
   * @param                  {String} name Port name
   * @param {PackXdslModemPortObject} currentPort Current Port
   * @return {Boolean}
   */
  this.uniqueName = function uniqueName(name, currentPort) {
    const found = find(this.ports, { name });
    if (!found) {
      return true;
    }
    if (!currentPort.id) {
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
  this.watchKey = function watchKey($event, port, valid) {
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
  this.update = function update(port) {
    return port.save($stateParams.serviceName);
  };

  /**
   * Delete a port redirection
   * @param {PackXdslModemPortObject} port Port to update
   * @return {Promise}
   */
  this.delete = function deleteFunction(port) {
    set(port, 'busy', true);
    return port
      .remove($stateParams.serviceName)
      .then((deletedPort) => {
        remove(self.ports, deletedPort);
      })
      .finally(() => {
        set(port, 'busy', false);
      });
  };

  /**
   * Add a port redirection
   */
  this.add = function add() {
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
        return !!find(this.ports, { editMode: true });
      },
    });

    OvhApiXdslModemPort.Aapi()
      .query({ xdslId: $stateParams.serviceName })
      .$promise.then((data) => {
        self.ports = map(data, (port) => new PackXdslModemPortObject(port));
      })
      .catch(() => {
        TucToast.error($translate.instant('xdsl_modem_ports_read_error'));
      })
      .finally(() => {
        self.loader = false;
      });
  }

  init();
}
