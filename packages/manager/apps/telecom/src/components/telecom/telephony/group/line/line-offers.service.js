/**
 * Container service for old OVH offers to handle previously available offers in OVH catalog
 * @return {Object}   Old offer container service
 */
export default /* @ngInject */ function VoipLineOldOffers() {
  const self = this;

  self.oldOffers = {
    sipNFax: ['10v1'],
  };
}
