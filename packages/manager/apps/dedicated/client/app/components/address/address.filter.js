/**
 * @type filter
 * @name filters:address
 */

angular
  .module('filters')
  .filter('address', ($translate, ipFeatureAvailability) => {
    function formatAddress(addressObject) {
      const country = $translate.instant(`country_${addressObject.country}`);
      if (ipFeatureAvailability.showState()) {
        return `${addressObject.address} ${addressObject.city} ${
          addressObject.state ? addressObject.state : ''
        } ${addressObject.zip ? addressObject.zip : ''} ${country}`;
      }
      return `${addressObject.address} ${
        addressObject.zip ? addressObject.zip : ''
      } ${addressObject.city} ${country}`;
    }

    return formatAddress;
  });
