angular
  .module('Module.otrs.services')
  .service('Module.otrs.services.NewTicket', [
    '$http',
    'constants',
    'WucApi',
    function OtrsNewTicketService($http, constants, WucApi) {
      this.getProduct = function getProduct(category) {
        return $http.get('apiv6/newTicket/product', {
          params: {
            category,
          },
        });
      };

      this.getEnumType = function getEnumType() {
        return WucApi.models('/apiv6/newTicket', 'support.TicketTypeEnum').then(
          (enumDetails) => enumDetails.enum,
        );
      };

      this.post = function post(data) {
        return $http.post('apiv6/newTicket', data);
      };
    },
  ]);
