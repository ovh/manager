import head from 'lodash/head';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import remove from 'lodash/remove';

export default /* @ngInject */ function XdslModemDhcpBdhcpCtrl(
  $stateParams,
  $translate,
  TucToast,
  tucValidator,
  PackXdslModemDhcpBdhcpObject,
  OvhApiXdsl,
  $q,
  TucPackXdslModemMediator,
) {
  const self = this;

  this.validator = tucValidator;
  this.mediator = TucPackXdslModemMediator;

  /**
   * submit / unsubmit with keys
   */
  this.watchKey = function watchKey($event, bdhcp, valid) {
    if ($event.keyCode === 13 && valid) {
      self.update(bdhcp);
    }
    if ($event.keyCode === 27) {
      this.cancel(bdhcp);
    }
  };

  /**
   * Cancel the edition of a BDHCP
   * @param {PackXdslModemDhcpBdhcpObject} bdhcp Static Address Description
   */
  this.cancel = function cancel(bdhcp) {
    if (!bdhcp.cancel()) {
      remove(self.bdhcps, bdhcp);
    }
  };

  /**
   * Update a BDHCP
   * @param {PackXdslModemDhcpBdhcpObject} bdhcp Static Address Description
   * @return {Promise}
   */
  this.update = function update(bdhcp) {
    return bdhcp.save($stateParams.serviceName, self.lanName, self.dhcpName);
  };

  /**
   * Add a BDHCP
   */
  this.add = function add() {
    const newBdhcp = new PackXdslModemDhcpBdhcpObject();
    self.bdhcps.push(newBdhcp);
    newBdhcp.edit();
  };

  /**
   * Delete a BDHCP
   * @param {PackXdslModemDhcpBdhcpObject} bdhcp Static Address Description
   * @return {Promise}
   */
  this.delete = function deleteFunction(bdhcp) {
    return bdhcp
      .remove($stateParams.serviceName, self.lanName, self.dhcpName)
      .then((deletedBdhcp) => remove(self.bdhcps, deletedBdhcp));
  };

  function getDhcp() {
    return OvhApiXdsl.Modem()
      .Lan()
      .Dhcp()
      .Aapi()
      .query({
        xdslId: $stateParams.serviceName,
      })
      .$promise.then((data) => {
        if (isArray(data) && data.length) {
          return head(data);
        }
        return $q.reject('No DHCP found');
      });
  }

  function init() {
    self.loader = true;
    getDhcp()
      .then((dhcp) => {
        self.lanName = dhcp.lanName;
        self.dhcpName = dhcp.dhcpName;
        self.bdhcps = map(dhcp.bdhcp, (elt) => {
          const bdhcp = new PackXdslModemDhcpBdhcpObject(elt);
          bdhcp.inApi();
          return bdhcp;
        });
      })
      .catch((err) => {
        TucToast.error($translate.instant('xdsl_modem_dhcp_error'));
        return $q.reject(err);
      })
      .finally(() => {
        self.loader = false;
      });
  }

  init();
}
