import find from 'lodash/find';
import set from 'lodash/set';

export default /* @ngInject */ function XdslAccessIpCtrl(
  $stateParams,
  OvhApiXdslIps,
  TucToastError,
  TucIpAddress,
  tucValidator,
) {
  const self = this;
  this.validator = tucValidator;
  this.ips = [];

  /**
   * Initialize the controller
   */
  this.init = function init() {
    self.xdslId = $stateParams.serviceName;
    self.ipBlock = decodeURIComponent($stateParams.block);
    self.loading = true;

    // Get notification number
    OvhApiXdslIps.Aapi()
      .reverse({
        ipBlock: $stateParams.block,
      })
      .$promise.then(
        (ips) => {
          self.ips = ips;
          self.loading = false;
        },
        (err) => {
          self.loading = false;
          return new TucToastError(err);
        },
      );
  };

  /**
   * Check if the IP is valid regarding the range
   * @param {String} ip IP to validate
   * @returns {Boolean}
   */
  this.checkIp = function checkIp(ip) {
    const ipv4 = TucIpAddress.address4(ip);
    if (!ipv4.isValid()) {
      return false;
    }
    const range = TucIpAddress.address4(decodeURIComponent($stateParams.block));
    if (!range.isValid()) {
      return false;
    }
    return ipv4.isInSubnet(range);
  };

  /**
   * Check if a new IP can be added
   * @returns {boolean}
   */
  this.canAdd = function canAdd() {
    return !find(self.ips, { editing: true });
  };

  /**
   * Add a new line in the table
   */
  this.add = function add() {
    this.ips.push({
      ipReverse: '',
      reverse: '',
      ipBlock: $stateParams.block,
      editing: true,
    });
  };

  /**
   * Undo the creation of a reverse
   * @param {Object} ip Reverse to undo
   */
  this.undo = function undo(ip) {
    const index = self.ips.indexOf(ip);
    if (index !== -1) {
      self.ips.splice(index, 1);
    }
  };

  /**
   * Delete a reverse DNS
   * @param {Object} ip Reverse to delete
   */
  this.delete = function deleteFunction(ip) {
    set(ip, 'updating', true);
    OvhApiXdslIps.v6()
      .deleteReverse(
        {
          ipBlock: decodeURIComponent($stateParams.block),
          ipReverse: ip.ipReverse,
        },
        null,
      )
      .$promise.then(
        () => {
          self.undo(ip);
        },
        (err) => {
          set(ip, 'updating', false);
          return new TucToastError(err);
        },
      );
  };

  /**
   * create a reverse DNS
   * @param {Object} ip Reverse to create
   */
  this.create = function create(ip) {
    set(ip, 'updating', true);
    OvhApiXdslIps.v6()
      .createReverse(
        {
          ipBlock: decodeURIComponent($stateParams.block),
        },
        {
          ipReverse: ip.ipReverse,
          reverse: ip.reverse,
        },
      )
      .$promise.then(
        () => {
          // eslint-disable-next-line no-param-reassign
          delete ip.editing;
          // eslint-disable-next-line no-param-reassign
          delete ip.updating;
        },
        (err) => {
          // eslint-disable-next-line no-param-reassign
          delete ip.updating;
          return new TucToastError(err);
        },
      );
  };

  /**
   * Refresh the sort of the list of IPs
   */
  this.refresh = function refresh() {
    self.ips.sort((a, b) => {
      if (a[self.sortBy] > b[self.sortBy]) {
        return self.revertSort ? -1 : 1;
      }
      if (a[self.sortBy] < b[self.sortBy]) {
        return self.revertSort ? 1 : -1;
      }
      return 0;
    });
  };

  this.init();
}
