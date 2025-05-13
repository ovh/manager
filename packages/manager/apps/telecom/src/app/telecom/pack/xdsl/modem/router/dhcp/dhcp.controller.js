import last from 'lodash/last';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

export default /* @ngInject */ function XdslModemDhcpCtrl(
  $q,
  $stateParams,
  $translate,
  $uibModal,
  OvhApiXdsl,
  PackXdslModemDhcpObject,
  TucPackXdslModemMediator,
  TucToast,
  tucValidator,
) {
  const self = this;
  this.validator = tucValidator;
  this.mediator = TucPackXdslModemMediator;

  /**
   * submit / unsubmit with keys
   * @param                   {Event} $event AngularJs Event
   * @param {PackXdslModemDhcpObject} dhcp   dhcp to update
   * @param                 {Boolean} valid  Form valid ?
   */
  this.watchKey = function watchKey($event, dhcp, valid) {
    if ($event.keyCode === 13 && valid) {
      self.submit(dhcp);
    }
    if ($event.keyCode === 27) {
      dhcp.cancel();
    }
  };

  /**
   * Submit a DHCP
   * @param {PackXdslModemDhcpObject} lan LAN to update
   * @return {Promise}
   */
  this.submit = function submit(dhcp) {
    return dhcp.save($stateParams.serviceName);
  };

  this.isIpInOrder = function isIpInOrder(ip1Param, ip2Param) {
    let ip1 = ip1Param;
    let ip2 = ip2Param;
    ip1 = map(ip1.split(/\./), (elt) => parseInt(elt, 10));
    ip2 = map(ip2.split(/\./), (elt) => parseInt(elt, 10));
    const comp = reduce(
      ip1,
      (result, val, index) => result && val <= ip2[index],
    );

    return comp && last(ip1) < last(ip2);
  };

  function init() {
    self.loader = true;
    self.isDNSValid = true;
    return OvhApiXdsl.Modem()
      .Lan()
      .Dhcp()
      .Aapi()
      .query({
        xdslId: $stateParams.serviceName,
      })
      .$promise.then((data) => {
        self.dhcps = map(data, (elt) => new PackXdslModemDhcpObject(elt));
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
