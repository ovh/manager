export default /* @ngInject */ function(atInternet) {
  const self = this;

  self.trackContractClick = function trackContractClick() {
    if (self.trackingPrefix) {
      atInternet.trackClick({
        name: `${self.trackingPrefix}::contract::download-contract`,
        type: 'action',
      });
    }
    return null;
  };
}
