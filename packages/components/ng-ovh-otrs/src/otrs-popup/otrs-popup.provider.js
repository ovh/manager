import angular from 'angular';

export default function () {
  const self = this;
  let baseUrlTickets = null;

  self.setBaseUrlTickets = (url) => {
    if (angular.isDefined(url) && angular.isString(url)) {
      baseUrlTickets = url;
    } else {
      throw new Error('An URL must be specified.');
    }
  };

  self.$get = () => ({
    getBaseUrlTickets() {
      return baseUrlTickets;
    },
  });
}
