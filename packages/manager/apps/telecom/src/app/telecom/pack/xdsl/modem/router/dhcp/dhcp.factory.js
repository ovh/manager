import assignIn from 'lodash/assignIn';
import isBoolean from 'lodash/isBoolean';
import pick from 'lodash/pick';
import without from 'lodash/without';

export default /* @ngInject */ (
  $q,
  $translate,
  $uibModal,
  OvhApiXdsl,
  TucToast,
) => {
  const template = {
    serverEnabled: true,
    defaultGateway: '',
    primaryDNS: '',
    secondaryDNS: null,
    domainName: '',
    startAddress: '',
    endAddress: '',
    leaseTime: null,
    lanName: '',
    dhcpName: '',
  };

  /**
   * Object constructor
   * @param {Object} data Data from APIv6
   */
  const PackXdslModemDhcpObject = function PackXdslModemDhcpObject(data) {
    assignIn(this, template, pick(data, Object.keys(template)));
  };

  PackXdslModemDhcpObject.prototype.save = function save(serviceName) {
    const self = this;
    this.busy = true;
    const params = pick(
      this.tempValue,
      without(Object.keys(template), 'lanName', 'dhcpName'),
    );
    params.secondaryDNS = params.secondaryDNS || null;
    return OvhApiXdsl.Modem()
      .Lan()
      .Dhcp()
      .v6()
      .update(
        {
          xdslId: serviceName,
          lanName: this.lanName,
          dhcpName: this.dhcpName,
        },
        params,
      )
      .$promise.then((data) => {
        assignIn(self, self.tempValue);
        self.toggleEdit(false);
        TucToast.success(
          $translate.instant('xdsl_modem_dhcp_success', {
            name: self.domainName,
          }),
        );
        return data;
      })
      .catch((err) => {
        if (err.data && err.data.message) {
          const regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
          const ipsList = err.data.message.match(regex);
          const [ipUsed, ...otherIps] = ipsList;
          $uibModal.open({
            animation: true,
            templateUrl:
              'app/telecom/pack/xdsl/modem/router/dhcp/dhcp-modal.html',
            controller: 'telecomXdslModemDhcpModal',
            controllerAs: '$ctrl',
            resolve: {
              messageIps: () => ({
                ipUsed,
                ipsToUse: otherIps.toString().replace(/,/g, ', '),
              }),
            },
          });
        } else {
          TucToast.error($translate.instant('xdsl_modem_dhcp_submit_error'));
        }
        return $q.reject(err);
      })
      .finally(() => {
        self.busy = false;
      });
  };

  /**
   * Cancel edit mode
   */
  PackXdslModemDhcpObject.prototype.cancel = function cancel() {
    this.toggleEdit(false);
    return this.id;
  };

  /**
   * Enter Edit Mode
   */
  PackXdslModemDhcpObject.prototype.edit = function edit() {
    this.tempValue = pick(this, Object.keys(template));
    this.toggleEdit(true);
  };

  /**
   * Toggle edit mode
   * @param {Boolean} state [Optional] if set, for the edit mode state
   * @return {Boolean} new edit mode state
   */
  PackXdslModemDhcpObject.prototype.toggleEdit = function toggleEdit(state) {
    if (isBoolean(state)) {
      this.editMode = state;
    } else {
      this.editMode = !this.editMode;
    }
    return this.editMode;
  };

  return PackXdslModemDhcpObject;
};
